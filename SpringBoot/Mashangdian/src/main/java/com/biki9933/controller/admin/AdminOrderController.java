package com.biki9933.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.biki9933.entity.*;
import com.biki9933.service.IOrderDetailService;
import com.biki9933.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/order")
public class AdminOrderController {

    @Autowired
    private IOrderService orderService;

    @Autowired
    private IOrderDetailService orderDetailService;

    /**
     * 根据条件分页查询
     * @param pageBean
     * @return
     */
    @RequestMapping("/list")
    public R list(@RequestBody PageBean pageBean){
        try {
            System.out.println("Received pageBean: " + pageBean);
            if (pageBean.getMerchantId() == null) {
                return R.error("商户ID不能为空");
            }
            
            // 确保页码不小于1
            if (pageBean.getPageNum() < 1) {
                pageBean.setPageNum(1);
            }
            
            Map<String,Object> map = new HashMap<>();
            map.put("merchantId", pageBean.getMerchantId());
            if (pageBean.getQuery() != null && !pageBean.getQuery().trim().isEmpty()) {
                map.put("status", pageBean.getQuery().trim());
            }
            map.put("start", (pageBean.getPageNum() - 1) * pageBean.getPageSize());
            map.put("pageSize", pageBean.getPageSize());
            
            List<Order> list = orderService.list(map);
            Long total = orderService.getTotal(map);
            
            Map<String,Object> data = new HashMap<>();
            data.put("orderList", list);
            data.put("total", total);
            
            return R.ok(data);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取订单列表失败：" + e.getMessage());
        }
    }

    /**
     * 更新订单状态
     * @param order
     * @return
     */
    @PostMapping("/receiving")
    public R receiving(@RequestBody Order order){
        Order resultOrder = orderService.getById(order.getId());
        resultOrder.setStatus(order.getStatus());
        orderService.updateById(resultOrder);
        return R.ok();
    }

    /**
     * 更新支付状态
     * @param order
     * @return
     */
    @PostMapping("/checkout")
    public R checkout(@RequestBody Order order){
        Order resultOrder = orderService.getById(order.getId());
        resultOrder.setStatus(order.getStatus());
        orderService.updateById(resultOrder);
        return R.ok();
    }

    /**
     * 删除订单
     * @param id
     * @return
     */
    @GetMapping("/delete/{id}")
    public R delete(@PathVariable(value = "id") Integer id){
        // 删除订单细表的数据
        orderDetailService.remove(new QueryWrapper<OrderDetail>().eq("mId",id));
        orderService.removeById(id);
        return R.ok();
    }

    /**
     * 数据分析：七天销售额
     * @return
     */
    @GetMapping("/salesvolume")
    public R salesvolume(@RequestParam Integer merchantId){
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("merchantId", merchantId);
            List<SalesVolume> salesVolumeList = orderService.getSalesVolume(params);
            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("salesVolumeList", salesVolumeList);
            resultMap.put("total", salesVolumeList.size());
            return R.ok(resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取销售统计失败：" + e.getMessage());
        }
    }

    /**
     * 更新订单状态
     * @param order
     * @return
     */
    @PostMapping("/updateStatus")
    public R updateStatus(@RequestBody Order order){
        Order resultOrder = orderService.getById(order.getId());
        if(resultOrder == null) {
            return R.error("订单不存在");
        }
        resultOrder.setStatus(order.getStatus());
        orderService.updateById(resultOrder);
        return R.ok();
    }

}
