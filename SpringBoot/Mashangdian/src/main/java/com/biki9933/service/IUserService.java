package com.biki9933.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.biki9933.entity.User;

import java.util.List;
import java.util.Map;

/**
 * 用户Service接口
 */
public interface IUserService extends IService<User> {
    
    /**
     * 根据条件分页查询用户列表
     */
    List<User> list(Map<String, Object> map);
    
    /**
     * 获取总记录数
     */
    Long getTotal(Map<String, Object> map);
    
    /**
     * 根据用户名获取用户
     */
    User getByUserName(String userName);
    
    /**
     * 创建新用户
     */
    User createUser(User user);
} 