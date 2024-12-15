package com.biki9933.constant;

/**
 * 系统常量
 */
public class SystemConstant {

    // 通用状态码
    public static final int SUCCESS_CODE = 200;
    public static final int ERROR_CODE = 500;
    public static final int UNAUTHORIZED_CODE = 401;
    public static final int FORBIDDEN_CODE = 403;

    // JWT相关常量
    public static final String JWT_SECRET = "8677df7fc3a34e26a61c034d5ec8245d"; // JWT密钥
    public static final long JWT_TTL = 24 * 60 * 60 * 1000; // JWT有效期（24小时）
    public static final String JWT_ADMIN_PREFIX = "ADMIN_"; // 管理员token前缀
    public static final String JWT_USER_PREFIX = "USER_"; // 用户token前缀

    // JWT错误码
    public static final int JWT_ERRCODE_NULL = 4000; // Token不存在
    public static final int JWT_ERRCODE_EXPIRE = 4001; // Token过期
    public static final int JWT_ERRCODE_FAIL = 4002; // Token验证失败

    // 商户相关错误码
    public static final int MERCHANT_NOT_EXIST = 1001;
    public static final int MERCHANT_DISABLED = 1002;
    public static final int MERCHANT_AUTH_FAIL = 1003;

    // 用户相关错误码
    public static final int USER_NOT_EXIST = 2001;
    public static final int USER_DISABLED = 2002;
    public static final int USER_AUTH_FAIL = 2003;

    // 订单相关错误码
    public static final int ORDER_NOT_EXIST = 3001;
    public static final int ORDER_STATUS_ERROR = 3002;

    // 桌号相关错误码
    public static final int TABLE_NOT_EXIST = 4001;
    public static final int TABLE_OCCUPIED = 4002;

    // 错误信息
    public static final String MERCHANT_NOT_EXIST_MSG = "商户不存在";
    public static final String MERCHANT_DISABLED_MSG = "商户已禁用";
    public static final String MERCHANT_AUTH_FAIL_MSG = "商户认证失败";

    public static final String USER_NOT_EXIST_MSG = "用户不存在";
    public static final String USER_DISABLED_MSG = "用户已禁用";
    public static final String USER_AUTH_FAIL_MSG = "用户认证失败";

    public static final String ORDER_NOT_EXIST_MSG = "订单不存在";
    public static final String ORDER_STATUS_ERROR_MSG = "订单状态错误";

    public static final String TABLE_NOT_EXIST_MSG = "桌号不存在";
    public static final String TABLE_OCCUPIED_MSG = "桌号已被占用";
}
