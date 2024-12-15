package com.biki9933.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.biki9933.constant.SystemConstant;
import com.biki9933.entity.*;
import com.biki9933.service.IDishService;
import com.biki9933.service.IOrderDetailService;
import com.biki9933.service.IOrderService;
import com.biki9933.service.ITableService;
import com.biki9933.service.IUserService;
import com.biki9933.mapper.OrderDetailMapper;
import com.biki9933.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @Autowired
    private IOrderDetailService orderDetailService;
    
    @Autowired
    private OrderDetailMapper orderDetailMapper;
    
    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private ITableService tableService;
    
    @Autowired
    private IDishService dishService;
    
    @Autowired
    private IUserService userService;

    /**
     * 创建订单
     */
    @PostMapping("/create")
    public R create(@RequestBody Order order) {
        try {
            System.out.println("创建订单 - 输入参数: " + order);
            System.out.println("接收到的商品列表: " + order.getGoods_list());
            
            // 打印前端发送的原始数据
            if (order.getGoods_list() != null) {
                System.out.println("\n前端发送的商品列表详情:");
                for (OrderDetail detail : order.getGoods_list()) {
                    System.out.println("商品信息:");
                    System.out.println("- dish_id: " + detail.getDish_id());
                    System.out.println("- quantity: " + detail.getQuantity());
                    System.out.println("- price: " + detail.getPrice());
                }
                System.out.println();
            }
            
            // 获取桌号对应的table_id和merchant_id
            Table table = tableService.getOne(new QueryWrapper<Table>()
                    .eq("number", order.getTable_number()));
                    
            if (table == null) {
                return R.error("未找到对应的桌号信息");
            }
            
            // 设置正确的table_id（数据库表的id）
            order.setTable_id(table.getId());
            
            // 确保merchantId不为空
            if (order.getMerchantId() == null) {
                order.setMerchantId(table.getMerchantId());
            }
            
            // 确保userId不为空
            if (order.getUserId() == null) {
                System.out.println("订单的用户ID为空，使用前端传递的user_id");
                Integer userId = order.getUserId();
                if (userId != null) {
                    order.setUserId(userId);
                } else {
                    System.out.println("user_id也为空，使用默认值1");
                    order.setUserId(1);
                }
            }
            
            // 确保total_amount不为空
            if (order.getTotal_amount() == null) {
                BigDecimal total = BigDecimal.ZERO;
                if (order.getGoods_list() != null) {
                    for (OrderDetail detail : order.getGoods_list()) {
                        BigDecimal itemTotal = detail.getPrice().multiply(new BigDecimal(detail.getQuantity()));
                        total = total.add(itemTotal);
                    }
                }
                order.setTotal_amount(total);
            }
            
            // 确保order_no不为空
            if (order.getOrder_no() == null || order.getOrder_no().trim().isEmpty()) {
                String timestamp = String.valueOf(System.currentTimeMillis());
                String random = String.valueOf(Math.floor(Math.random() * 1000));
                order.setOrder_no(timestamp + random);
            }
            
            // 设置订单状态为待支付
            order.setStatus(1);
            
            // 设置创建时间
            if (order.getCreate_time() == null) {
                order.setCreate_time(new Date());
            }
            
            // 保存订单详情列表的副本
            List<OrderDetail> orderDetails = new ArrayList<>();
            if (order.getGoods_list() != null) {
                for (OrderDetail detail : order.getGoods_list()) {
                    OrderDetail newDetail = new OrderDetail();
                    
                    // 验证菜品ID
                    if (detail.getDish_id() == null) {
                        throw new RuntimeException("菜品ID不能为空");
                    }
                    
                    // 验证菜品是否存在
                    Dish dish = dishService.getById(detail.getDish_id());
                    if (dish == null) {
                        throw new RuntimeException("菜品不存在: " + detail.getDish_id());
                    }
                    
                    newDetail.setDish_id(detail.getDish_id());
                    newDetail.setQuantity(detail.getQuantity());
                    newDetail.setPrice(detail.getPrice());
                    orderDetails.add(newDetail);
                    
                    System.out.println("\n订单详情数据:");
                    System.out.println("- 菜品ID: " + detail.getDish_id());
                    System.out.println("- 菜品名称: " + dish.getName());
                    System.out.println("- 数量: " + detail.getQuantity());
                    System.out.println("- 价格: " + detail.getPrice());
                }
            }
            
            // 保存订单
            boolean saveResult = orderService.save(order);
            System.out.println("订单保存结果: " + saveResult);
            System.out.println("订单已创建 - ID: " + order.getId());
            
            // 保存订单详情
            if (orderDetails != null && !orderDetails.isEmpty()) {
                System.out.println("\n开始保存订单详情:");
                System.out.println("- 订单ID: " + order.getId());
                System.out.println("- 订单详情数量: " + orderDetails.size());
                
                for(OrderDetail detail : orderDetails){
                    try {
                        detail.setOrder_id(order.getId());
                        
                        System.out.println("\n保存订单详情项:");
                        System.out.println("- ID: " + detail.getId());
                        System.out.println("- 订单ID: " + detail.getOrder_id());
                        System.out.println("- 菜品ID: " + detail.getDish_id());
                        System.out.println("- 数量: " + detail.getQuantity());
                        System.out.println("- 价格: " + detail.getPrice());
                        
                        int result = orderDetailService.insert(detail);
                        System.out.println("订单详情保存结果: " + result);
                        System.out.println("保存后的订单详情ID: " + detail.getId());
                    } catch (Exception e) {
                        System.err.println("保存订单详情失败: " + e.getMessage());
                        e.printStackTrace();
                        throw e;
                    }
                }
            }
            
            // 查询完整的订单信息
            Order savedOrder = orderService.getById(order.getId());
            if (savedOrder != null) {
                // 查询订单详情
                QueryWrapper<OrderDetail> detailQueryWrapper = new QueryWrapper<OrderDetail>()
                        .eq("order_id", savedOrder.getId());
                List<OrderDetail> goods_list = orderDetailService.list(detailQueryWrapper);
                savedOrder.setGoods_list(goods_list);
                
                Map<String, Object> resultMap = new HashMap<>();
                resultMap.put("order", savedOrder);
                return R.ok(resultMap);
            }
            
            return R.ok();
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("创建订单失败：" + e.getMessage());
        }
    }

    /**
     * 获取桌号当前订单
     */
    @GetMapping("/get")
    public R get(@RequestParam String table_number,
                @RequestParam(required = false) String transac_status) {
        try {
            System.out.println("获取订单信息 - 桌号: " + table_number + ", 状态: " + transac_status);
            
            // 获取桌号对应的table_id
            Table table = tableService.getOne(new QueryWrapper<Table>()
                    .eq("number", table_number));
            
            if (table == null) {
                System.out.println("未找到桌号: " + table_number);
                return R.error("未找到对应的桌号信息");
            }
            
            System.out.println("找到桌号ID: " + table.getId());
            
            // 构建查询条件，获取所有订单字段
            QueryWrapper<Order> queryWrapper = new QueryWrapper<Order>()
                    .eq("table_id", table.getId());
            
            // 如果指定了状态，添加状态条件
            if ("unsettled".equals(transac_status)) {
                queryWrapper.eq("status", 1); // 支付状态
            }
            
            // 按创建时间倒序，获取最新订单
            queryWrapper.orderByDesc("create_time").last("LIMIT 1");
            
            // 使用orderMapper直接查询，确保获取所有字段
            Order order = orderMapper.selectOne(queryWrapper);
            
            if (order == null) {
                System.out.println("未找到订单 - table_id: " + table.getId() + ", status: " + transac_status);
                return R.error("未找到相关订单");
            }
            
            System.out.println("找到订单ID: " + order.getId());
            System.out.println("订单基本信息: " + order);
            System.out.println("订单创建时间: " + order.getCreate_time());
            
            // 使用自定义的listByOrderId法查询订单详情
            List<OrderDetail> goods_list = orderDetailMapper.listByOrderId(order.getId());
            
            System.out.println("\n订单详情查询结果:");
            System.out.println("- 订单ID: " + order.getId());
            System.out.println("- 创建时间: " + order.getCreate_time());
            System.out.println("- 查询到的详情数量: " + (goods_list != null ? goods_list.size() : 0));
            
            if (goods_list != null) {
                for (OrderDetail detail : goods_list) {
                    System.out.println("\n订单详情项:");
                    System.out.println("- 详情ID: " + detail.getId());
                    System.out.println("- 订单ID: " + detail.getOrder_id());
                    System.out.println("- 创建时间: " + detail.getCreate_time());
                    System.out.println("- 菜品ID: " + detail.getDish_id());
                    System.out.println("- 数量: " + detail.getQuantity());
                    System.out.println("- 价格: " + detail.getPrice());
                    
                    // 计算商品总价
                    if (detail.getPrice() != null && detail.getQuantity() != null) {
                        BigDecimal itemTotal = detail.getPrice().multiply(new BigDecimal(detail.getQuantity()));
                        detail.setTotal_price(itemTotal);
                        System.out.println("- 总价: " + itemTotal);
                    }
                    
                    // 从Order对象获取create_time
                    detail.setCreate_time(order.getCreate_time());
                    
                    // 获取菜品信息
                    if (detail.getDish_id() != null) {
                        Dish dish = dishService.getById(detail.getDish_id());
                        if (dish != null) {
                            detail.setName(dish.getName());
                            detail.setUnit(dish.getUnit());
                            detail.setImage(dish.getImage());
                            System.out.println("- 菜品名称: " + dish.getName());
                            System.out.println("- 菜品单位: " + dish.getUnit());
                        } else {
                            System.out.println("警告：未找到菜品信息，dish_id: " + detail.getDish_id());
                            detail.setName("未知菜品");
                            detail.setUnit("份");
                            detail.setImage("default.png");
                        }
                    }
                }
            }
            
            // 设置订单的商品列表
            order.setGoods_list(goods_list);
            
            // 设置桌号信息（显示用）
            order.setTable_number(table.getNumber());
            
            // 计算总金额（如果为空）
            if (order.getTotal_amount() == null || order.getTotal_amount().compareTo(BigDecimal.ZERO) == 0) {
                BigDecimal totalAmount = BigDecimal.ZERO;
                if (goods_list != null) {
                    for (OrderDetail detail : goods_list) {
                        if (detail.getPrice() != null && detail.getQuantity() != null) {
                            BigDecimal itemTotal = detail.getPrice().multiply(new BigDecimal(detail.getQuantity()));
                            totalAmount = totalAmount.add(itemTotal);
                        }
                    }
                }
                order.setTotal_amount(totalAmount);
            }
            // 确保create_time不为空
            if (order.getCreate_time() == null) {
                System.out.println("Warning: Order create_time is null, setting current time");
                order.setCreate_time(new Date());
            }
            System.out.println("Final order create_time: " + order.getCreate_time());
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("order", order);
            return R.ok(resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取订单信息失败：" + e.getMessage());
        }
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/detail")
    public R detail(@RequestParam Integer merchantId,
                   @RequestParam Integer orderId) {
        Order order = orderService.getOne(new QueryWrapper<Order>()
                .eq("merchant_id", merchantId)
                .eq("id", orderId));
                
        if (order == null) {
            return R.error(SystemConstant.ORDER_NOT_EXIST, SystemConstant.ORDER_NOT_EXIST_MSG);
        }
        
        // 获取订单详情
        List<OrderDetail> goods_list = orderDetailMapper.listByOrderId(order.getId());
                
        // 设置订单详情的显示字段
        for (OrderDetail detail : goods_list) {
            // 获取菜品信息
            Dish dish = dishService.getById(detail.getDish_id());
            if (dish != null) {
                detail.setName(dish.getName());
                detail.setUnit(dish.getUnit());
                detail.setImage(dish.getImage());
            }
            
            // 计算商品总价
            if (detail.getPrice() != null && detail.getQuantity() != null) {
                BigDecimal itemTotal = detail.getPrice().multiply(new BigDecimal(detail.getQuantity()));
                detail.setTotal_price(itemTotal);
            }
            
            // 设置订单编号和创建时间
            detail.setOrder_no(order.getOrder_no());
            detail.setCreate_time(order.getCreate_time());
            
            detail.setQuantity_str(String.valueOf(detail.getQuantity()));
        }
        
        order.setGoods_list(goods_list);
        
        // 获取桌号信息
        Table table = tableService.getById(order.getTable_id());
        if (table != null) {
            order.setTable_number(table.getNumber());
        }
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("order", order);
        return R.ok(resultMap);
    }

    /**
     * 获取桌号当前订单
     */
    @GetMapping("/current")
    public R current(@RequestParam Integer merchantId,
                    @RequestParam Integer tableId) {
        Order order = orderService.getOne(new QueryWrapper<Order>()
                .eq("merchant_id", merchantId)
                .eq("table_id", tableId)
                .eq("status", 1)  // 待支付状态
                .orderByDesc("create_time")
                .last("LIMIT 1"));
                
        if (order == null) {
            return R.error(SystemConstant.ORDER_NOT_EXIST, SystemConstant.ORDER_NOT_EXIST_MSG);
        }
        
        // 获取订单详情
        List<OrderDetail> goods_list = orderDetailService.list(new QueryWrapper<OrderDetail>()
                .eq("mId", order.getId()));
        order.setGoods_list(goods_list);
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("order", order);
        return R.ok(resultMap);
    }

    /**
     * 获取用户订单历史
     */
    @GetMapping("/history")
    public R history(@RequestParam Integer merchantId,
                    @RequestParam Integer userId,
                    @RequestParam(defaultValue = "1") Integer page,
                    @RequestParam(defaultValue = "10") Integer limit) {
        Map<String, Object> map = new HashMap<>();
        map.put("merchantId", merchantId);
        map.put("userId", userId);
        map.put("start", (page - 1) * limit);
        map.put("pageSize", limit);
        
        List<Order> orderList = orderService.list(map);
        Long total = orderService.getTotal(map);
        
        // 获取每个订单详情
        for (Order order : orderList) {
            List<OrderDetail> goods_list = orderDetailService.list(new QueryWrapper<OrderDetail>()
                    .eq("mId", order.getId()));
            order.setGoods_list(goods_list);
        }
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("orderList", orderList);
        resultMap.put("total", total);
        return R.ok(resultMap);
    }
}
