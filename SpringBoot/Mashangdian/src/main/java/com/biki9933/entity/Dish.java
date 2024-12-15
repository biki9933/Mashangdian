package com.biki9933.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

import java.util.Date;

/**
 * 菜品实体
 */
@TableName("t_dish")
@Data
public class Dish {

    private Integer id; // 编号

    private Integer merchantId; // 商户ID

    private String name; // 菜品名称

    private String image; // 菜品图片

    @TableField("typeId")
    private Integer typeId; // 类别ID

    @TableField(select = false)
    private Category type; // 类别

    private Integer monthlysale;  // 商品销售量

    private Float unitprice; // 商品单价

    private String unit; // 商品单位

    private Integer quantity; // 商品数量

    @JsonSerialize(using=CustomDateTimeSerializer.class)
    private Date time; // 上架时间

    private boolean onsale; // true：上架 false：下架

    @TableField(select = false)
    private Merchant merchant; // 所属商户

}
