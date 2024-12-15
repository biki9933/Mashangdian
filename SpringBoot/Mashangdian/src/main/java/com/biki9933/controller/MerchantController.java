package com.biki9933.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.biki9933.constant.SystemConstant;
import com.biki9933.entity.Merchant;
import com.biki9933.entity.R;
import com.biki9933.entity.Table;
import com.biki9933.service.IMerchantService;
import com.biki9933.service.ITableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 商户Controller
 */
@RestController
@RequestMapping("/merchant")
@CrossOrigin
public class MerchantController {

    @Autowired
    private IMerchantService merchantService;

    @Autowired
    private ITableService tableService;

    /**
     * 获取商户列表
     */
    @GetMapping("/list")
    public R list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                 @RequestParam(value = "limit", defaultValue = "10") Integer limit,
                 @RequestParam(value = "name", required = false) String name) {
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("start", (page - 1) * limit);
            map.put("pageSize", limit);
            if (name != null && !name.isEmpty()) {
                map.put("merchantName", name);
            }
            map.put("status", true); // 只查询正常状态的商户
            
            List<Merchant> merchantList = merchantService.list(map);
            Long total = merchantService.getTotal(map);
            
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("merchantList", merchantList);
            resultMap.put("total", total);
            
            return R.ok(resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取商户列表失败：" + e.getMessage());
        }
    }

    /**
     * 根据桌号获取商户信息
     */
    @GetMapping("/getByTable/{tableNumber}")
    public R getByTableNumber(@PathVariable String tableNumber) {
        // 根据桌号查询桌位信息
        Table table = tableService.getOne(new QueryWrapper<Table>().eq("number", tableNumber));
        if (table == null) {
            return R.error(SystemConstant.TABLE_NOT_EXIST, SystemConstant.TABLE_NOT_EXIST_MSG);
        }
        
        // 获取商户信息
        Merchant merchant = merchantService.findById(table.getMerchantId());
        if (merchant == null) {
            return R.error(SystemConstant.MERCHANT_NOT_EXIST, SystemConstant.MERCHANT_NOT_EXIST_MSG);
        }
        
        // 验证商户状态
        if (!merchant.getStatus()) {
            return R.error(SystemConstant.MERCHANT_DISABLED, SystemConstant.MERCHANT_DISABLED_MSG);
        }
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("merchant", merchant);
        resultMap.put("table", table);
        return R.ok(resultMap);
    }

    /**
     * 获取商户详情
     */
    @GetMapping("/info/{id}")
    public R info(@PathVariable Integer id) {
        Merchant merchant = merchantService.findById(id);
        if (merchant == null) {
            return R.error(SystemConstant.MERCHANT_NOT_EXIST, SystemConstant.MERCHANT_NOT_EXIST_MSG);
        }
        
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("merchant", merchant);
        return R.ok(resultMap);
    }
} 