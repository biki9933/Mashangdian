package com.biki9933.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.biki9933.entity.OrderDetail;
import com.biki9933.mapper.OrderDetailMapper;
import com.biki9933.service.IOrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * 订单细表Service实现类
 */
@Service("orderDetailService")
public class IOrderDetailServiceImpl extends ServiceImpl<OrderDetailMapper,OrderDetail> implements IOrderDetailService {

    @Autowired
    private OrderDetailMapper orderDetailMapper;

    @Override
    public int insert(OrderDetail orderDetail) {
        System.out.println("OrderDetailService - 开始插入订单详情:");
        System.out.println("- ID: " + orderDetail.getId());
        System.out.println("- 订单ID: " + orderDetail.getOrder_id());
        System.out.println("- 菜品ID: " + orderDetail.getDish_id());
        System.out.println("- 数量: " + orderDetail.getQuantity());
        System.out.println("- 价格: " + orderDetail.getPrice());
        
        int result = orderDetailMapper.insert(orderDetail);
        
        System.out.println("OrderDetailService - 插入结果: " + result);
        System.out.println("OrderDetailService - 插入后的ID: " + orderDetail.getId());
        
        return result;
    }
}
