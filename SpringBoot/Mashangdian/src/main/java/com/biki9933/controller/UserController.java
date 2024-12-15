package com.biki9933.controller;

import com.biki9933.entity.R;
import com.biki9933.entity.User;
import com.biki9933.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户Controller
 */
@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private IUserService userService;

    /**
     * 用户验证/创建
     */
    @PostMapping("/verify")
    public R verify(@RequestBody User user) {
        try {
            // 参数验证
            if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
                return R.error("用户名不能为空");
            }

            // 查找用户是否存在
            User existUser = userService.getByUserName(user.getUserName());
            
            if (existUser == null) {
                // 用户不存在，创建新用户
                User newUser = new User();
                newUser.setUserName(user.getUserName().trim());
                userService.save(newUser);
                existUser = userService.getByUserName(newUser.getUserName()); // 重新获取以确保有ID
            }
            
            if (existUser == null) {
                return R.error("用户创建失败");
            }
            
            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("user", existUser);
            return R.ok(resultMap);
            
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("操作失败：" + e.getMessage());
        }
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/info")
    public R info(@RequestParam Integer userId) {
        User user = userService.getById(userId);
        if (user == null) {
            return R.error("用户不存在");
        }
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("user", user);
        return R.ok(resultMap);
    }
} 