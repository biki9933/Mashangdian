package com.biki9933.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.biki9933.entity.OrderDetail;
import org.apache.ibatis.annotations.Param;

/**
 * 订单细表Mapper接口
 */
public interface OrderDetailMapper extends BaseMapper<OrderDetail> {
    
    /**
     * 插入订单详情
     */
    int insert(OrderDetail orderDetail);
    
    /**
     * 根据订单ID查询订单详情列表
     */
    java.util.List<OrderDetail> listByOrderId(@Param("orderId") Integer orderId);
}
