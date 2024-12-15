package com.biki9933.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.biki9933.entity.Order;
import com.biki9933.entity.SalesVolume;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 订单Mapper接口
 */
public interface OrderMapper extends BaseMapper<Order> {

    /**
     * 根据条件分页查询
     * @param map
     * @return
     */
    List<Order> list(Map<String,Object> map);

    /**
     * 根据条件查询总记录数
     * @param map
     * @return
     */
    Long getTotal(Map<String,Object> map);

    /**
     * 获取销售统计数据
     * @param params 查询参数，包含merchantId
     * @return
     */
    List<SalesVolume> getSalesVolume(Map<String, Object> params);

    /**
     * 根据桌号和状态获取最新订单
     */
    Order getOne(@Param("table_id") Integer tableId, @Param("status") Integer status);
}
