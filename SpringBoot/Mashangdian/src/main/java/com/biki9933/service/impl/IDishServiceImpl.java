package com.biki9933.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.biki9933.entity.Dish;
import com.biki9933.mapper.DishMapper;
import com.biki9933.service.IDishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 菜品Service实现类
 */
@Service("dishService")
public class IDishServiceImpl extends ServiceImpl<DishMapper,Dish> implements IDishService {

    @Autowired
    private DishMapper dishMapper;

    @Override
    public List<Dish> list(Map<String, Object> map) {
        return dishMapper.list(map);
    }

    @Override
    public Long getTotal(Map<String, Object> map) {
        return dishMapper.getTotal(map);
    }

    @Override
    public List<Map<String, Object>> getDishSalesStatistics(Integer merchantId) {
        return dishMapper.getDishSalesStatistics(merchantId);
    }
}
