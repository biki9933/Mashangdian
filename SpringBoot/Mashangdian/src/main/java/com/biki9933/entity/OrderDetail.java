package com.biki9933.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 订单详细表
 */
@TableName("t_order_detail")
@Data
public class OrderDetail {

    private Integer id; // 编号

    @TableField("order_id")
    private Integer order_id; // 订单ID

    @TableField(value = "dish_id")
    @JsonProperty("dish_id")
    private Integer dish_id; // 菜品ID

    @TableField("quantity")
    private Integer quantity; // 数量

    @TableField("price")
    private BigDecimal price; // 单价

    @TableField(exist = false)
    private String name; // 菜品名称（显示用）

    @TableField(exist = false)
    private String unit; // 单位（显示用）

    @TableField(exist = false)
    private String image; // 菜品图片（显示用）

    @TableField(exist = false)
    private BigDecimal total_price; // 总价（显示用）

    @TableField(exist = false)
    private String quantity_str; // 数量字符串（用于接收前端传来的字符串类型数量）

    @TableField(exist = false)
    @JsonProperty("create_time")
    @JsonSerialize(using=CustomDateTimeSerializer.class)
    private Date create_time; // 订单创建时间

    @TableField(exist = false)
    @JsonProperty("order_no")
    private String order_no; // 订单号

    

}
