package com.biki9933.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.biki9933.entity.Dish;

import java.util.List;
import java.util.Map;

/**
 * 菜品Mapper接口
 */
public interface DishMapper extends BaseMapper<Dish> {

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
     * @param merchantId 商户ID
     * @return
     */
    public List<Map<String, Object>> getDishSalesStatistics(Integer merchantId);
}

