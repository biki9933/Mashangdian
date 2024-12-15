package com.biki9933.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 商户实体
 */
@TableName("t_merchant")
@Data
public class Merchant {
    
    private Integer id; // 编号

        @TableField("contact_name")
        private String contactName;

        @TableField("contact_phone")
        private String contactPhone;

        @TableField("merchant_name")
        private String merchantName;
    
    private String address; // 商户地址
    
    private Boolean status; // 商户状态 true:正常 false:禁用
} 