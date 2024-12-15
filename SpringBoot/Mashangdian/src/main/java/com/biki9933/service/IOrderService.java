package com.biki9933.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.biki9933.entity.Order;
import com.biki9933.entity.SalesVolume;

import java.util.List;
import java.util.Map;


/**
 * 订单主表Service接口
 */
public interface IOrderService extends IService<Order> {

    /**
     * 根据条件 分页查询
     * @param map
     * @return
     */
    public List<Order> list(Map<String,Object> map);

    /**
     * 根据条件，查询订单总记录数
     * @param map
     * @return
     */
    public Long getTotal(Map<String,Object> map);

    public List<SalesVolume> getSalesVolume(Map<String, Object> params);

}
