package com.biki9933.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.biki9933.entity.User;
import com.biki9933.mapper.UserMapper;
import com.biki9933.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 用户Service实现类
 */
@Service("userService")
public class IUserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<User> list(Map<String, Object> map) {
        return userMapper.list(map);
    }

    @Override
    public Long getTotal(Map<String, Object> map) {
        return userMapper.getTotal(map);
    }

    @Override
    public User getByUserName(String userName) {
        return getOne(new QueryWrapper<User>().eq("user_name", userName));
    }

    @Override
    public User createUser(User user) {
        save(user);
        return user;
    }
} 