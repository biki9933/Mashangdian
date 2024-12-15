package com.biki9933.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.biki9933.entity.Dish;

import java.util.List;
import java.util.Map;


/**
 * 菜品Service接口
 */
public interface IDishService extends IService<Dish> {

    /**
     * 根据条件 分页查询
     * @param map
     * @return
     */
    public List<Dish> list(Map<String,Object> map);

    /**
     * 根据条件，查询总记录数
     * @param map
     * @return
     */
    public Long getTotal(Map<String,Object> map);

    /**
     * 获取菜品销售统计
     * @return
     */
    List<Map<String, Object>> getDishSalesStatistics(Integer merchantId);

}
