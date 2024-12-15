package com.biki9933.util;

import com.biki9933.constant.SystemConstant;
import com.biki9933.entity.CheckResult;
import io.jsonwebtoken.*;
import org.bouncycastle.util.encoders.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 */
public class JwtUtils {

    /**
     * 创建JWT Token
     * @param userId 用户ID
     * @param merchantId 商户ID
     * @param isAdmin 是否是管理员
     * @return token字符串
     */
    public static String createToken(Integer userId, Integer merchantId, boolean isAdmin) {
        // 准备存放在token中的信息
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("merchantId", merchantId);
        claims.put("isAdmin", isAdmin);
        claims.put("createTime", System.currentTimeMillis());

        // 生成token
        JwtBuilder builder = Jwts.builder()
                .setId(isAdmin ? SystemConstant.JWT_ADMIN_PREFIX + userId : SystemConstant.JWT_USER_PREFIX + userId)
                .setClaims(claims)
                .setIssuer("diancan")
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, generalKey());

        // 设置过期时间
        long expMillis = System.currentTimeMillis() + SystemConstant.JWT_TTL;
        Date exp = new Date(expMillis);
        builder.setExpiration(exp);

        return builder.compact();
    }

    /**
     * 验证JWT
     */
    public static CheckResult validateToken(String token) {
        CheckResult checkResult = new CheckResult();
        Claims claims;

        try {
            claims = parseToken(token);
            checkResult.setSuccess(true);
            checkResult.setClaims(claims);
        } catch (ExpiredJwtException e) {
            checkResult.setErrCode(SystemConstant.JWT_ERRCODE_EXPIRE);
            checkResult.setSuccess(false);
        } catch (SignatureException e) {
            checkResult.setErrCode(SystemConstant.JWT_ERRCODE_FAIL);
            checkResult.setSuccess(false);
        } catch (Exception e) {
            checkResult.setErrCode(SystemConstant.JWT_ERRCODE_FAIL);
            checkResult.setSuccess(false);
        }

        return checkResult;
    }

    /**
     * 解析JWT
     */
    public static Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(generalKey())
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 从token中获取用户ID
     */
    public static Integer getUserId(String token) {
        Claims claims = parseToken(token);
        return (Integer) claims.get("userId");
    }

    /**
     * 从token中获取商户ID
     */
    public static Integer getMerchantId(String token) {
        Claims claims = parseToken(token);
        return (Integer) claims.get("merchantId");
    }

    /**
     * 从token中获取是否是管理员
     */
    public static Boolean isAdmin(String token) {
        Claims claims = parseToken(token);
        return (Boolean) claims.get("isAdmin");
    }

    /**
     * 生成加密密钥
     */
    private static SecretKey generalKey() {
        byte[] encodedKey = Base64.decode(SystemConstant.JWT_SECRET);
        return new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
    }
}
