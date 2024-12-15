package com.biki9933.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.List;


@TableName("t_category")
@Data
public class Category {

    private Integer id; // 编号

    private Integer merchantId; // 商户ID

    private String name; // 名称

    private String value; // 值

    private Integer count; // 数量

    private Integer sele_quantity; // 选择数量

    private String cid; //  id标识

    private Integer sort; // 排序字段

    @TableField(select = false)
    private List<Dish> dishList; // 拥有的菜品

    @TableField(select = false)
    private Merchant merchant; // 所属商户
}
