package com.biki9933.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 管理员实体
 */

@Data
@TableName("t_admin")
public class Admin {
    private Integer id;

    @TableField("merchant_id")
    private Integer merchantId;

    @TableField("username")  // 映射到数据库的 username 字段
    private String userName; // 对应前端发送的 userName

    private String password;
}