package com.biki9933.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.biki9933.entity.OrderDetail;

/**
 * 订单细表Service接口
 */
public interface IOrderDetailService extends IService<OrderDetail> {

    /**
     * 插入订单详情
     */
    int insert(OrderDetail orderDetail);
    
}
