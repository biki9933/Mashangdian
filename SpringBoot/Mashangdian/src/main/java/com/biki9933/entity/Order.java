package com.biki9933.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 订单主表
 */
@TableName("t_order")
@Data
@ToString(exclude = {"goods_list"})
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order {

    private Integer id; // 编号

    private Integer merchantId; // 商户ID

    private Integer userId; // 用户ID
    
    private Integer table_id; // 桌号ID（关联t_table表的id）

    private String order_no; // 订单号

    private BigDecimal total_amount; // 订单总金额

    private Integer status; // 订单状态：1待支付 2已支付 3已完成 4已取消

    @JsonSerialize(using=CustomDateTimeSerializer.class)
    @JsonProperty("create_time")
    @TableField(value = "create_time")
    private Date create_time; // 创建时间

    @TableField(select = false,exist = false)
    @JsonProperty("goods_list")
    private List<OrderDetail> goods_list; // 订单详情

    @TableField(select = false)
    private Merchant merchant; // 所属商户

    @TableField(select = false)
    private User user; // 下单用户

    @TableField(exist = false)
    private String table_number; // 桌号（显示用，对应t_table表的number字段）

    public List<OrderDetail> getGoods_list() {
        if (goods_list == null) {
            System.out.println("Warning: goods_list is null in getter");
        } else {
            System.out.println("goods_list size in getter: " + goods_list.size());
        }
        return goods_list;
    }

    public void setGoods_list(List<OrderDetail> goods_list) {
        if (goods_list == null) {
            System.out.println("Warning: Setting null goods_list");
        } else {
            System.out.println("Setting goods_list with size: " + goods_list.size());
        }
        this.goods_list = goods_list;
    }
}
