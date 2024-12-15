package com.biki9933.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 桌号实体
 */
@TableName("t_table")
@Data
public class Table implements Serializable {

    private Integer id; // 编号

    private Integer merchantId; // 商户ID

    private String number; // 桌号

    private String qrcode; // 二维码地址

    private Integer status; // 状态 1:空闲 0:占用

    @JsonSerialize(using=CustomDateTimeSerializer.class)
    @TableField(value = "create_time")
    private Date createTime; // 创建时间

    @TableField(select = false)
    private Merchant merchant; // 所属商户

}
