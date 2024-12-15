package com.biki9933.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.biki9933.entity.Order;
import com.biki9933.entity.SalesVolume;
import com.biki9933.mapper.OrderMapper;
import com.biki9933.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


/**
 * 订单主表Service实现类

 */
@Service("orderService")
public class IOrderServiceImpl extends ServiceImpl<OrderMapper,Order> implements IOrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public List<Order> list(Map<String, Object> map) {
        return orderMapper.list(map);
    }

    @Override
    public Long getTotal(Map<String, Object> map) {
        return orderMapper.getTotal(map);
    }

    @Override
    public List<SalesVolume> getSalesVolume(Map<String, Object> params) {
        return orderMapper.getSalesVolume(params);
    }
}
