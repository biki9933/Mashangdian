package com.biki9933.interceptor;

import com.biki9933.util.JwtUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;

/**
 * 认证拦截器
 */
public class AuthInterceptor implements HandlerInterceptor {

    // 不需要验证的路径
    private static final List<String> EXCLUDE_PATHS = Arrays.asList(
            "/user/auth",
            "/merchant/list",
            "/merchant/getByTableNumber",
            "/table/scan"
    );

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        
        // 排除不需要验证的路径
        if (EXCLUDE_PATHS.stream().anyMatch(path::startsWith)) {
            return true;
        }

        // 获取请求头中的token
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            return false;
        }

        // 验证token
        try {
            // 管理端请求
            if (path.startsWith("/admin")) {
                // 验证token中的merchantId和管理员身份
                Integer merchantId = JwtUtils.getMerchantId(token);
                Boolean isAdmin = JwtUtils.isAdmin(token);
                
                if (merchantId == null || !isAdmin) {
                    response.setStatus(403);
                    return false;
                }
                
                // 将merchantId设置到request中
                request.setAttribute("merchantId", merchantId);
            }
            // 小程序端请求
            else {
                // 验证请求参数中是否包含merchantId和userId
                String merchantId = request.getParameter("merchantId");
                String userId = request.getParameter("userId");
                
                if (merchantId == null || userId == null) {
                    response.setStatus(400);
                    return false;
                }
            }
            
            return true;
        } catch (Exception e) {
            response.setStatus(401);
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
} 