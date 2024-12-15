package com.biki9933.controller.admin;

import com.biki9933.entity.OrderDetail;
import com.biki9933.entity.R;
import com.biki9933.service.IOrderDetailService;
import com.biki9933.mapper.OrderDetailMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/orderDetail")
public class AdminOrderDetailController {

    @Autowired
    private IOrderDetailService orderDetailService;
    
    @Autowired
    private OrderDetailMapper orderDetailMapper;

    /**
     * 根据订单号查询订单详情
     * @param id
     * @return
     */
    @GetMapping("/list")
    public R listByOrderId(Integer id){
        System.out.println("查询订单详情，订单ID=" + id);
        List<OrderDetail> orderDetailList = orderDetailMapper.listByOrderId(id);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("list", orderDetailList);
        return R.ok(resultMap);
    }

}
