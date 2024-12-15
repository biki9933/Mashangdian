package com.biki9933.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${qrcodeImgsFilePath}")
    private String qrcodeImgsFilePath;

    @Value("${dishImgsFilePath}")
    private String dishImgsFilePath;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept")
                .allowCredentials(false)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置二维码图片映射
        registry.addResourceHandler("/image/qrcode/**")
                .addResourceLocations("file:" + qrcodeImgsFilePath);
        
        // 配置菜品图片映射
        registry.addResourceHandler("/image/dish/**")
                .addResourceLocations("file:" + dishImgsFilePath);
        
        // 配置背景图片映射
        registry.addResourceHandler("/image/**")
                .addResourceLocations("classpath:/static/image/");
    }
} 