package com.biki9933.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 用户实体
 */
@TableName("t_user")
@Data
public class User {
    
    private Integer id; // 编号
    
    private String userName; // 用户名
} 