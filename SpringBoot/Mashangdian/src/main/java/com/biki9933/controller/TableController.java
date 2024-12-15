package com.biki9933.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.biki9933.entity.Merchant;
import com.biki9933.entity.R;
import com.biki9933.entity.Table;
import com.biki9933.service.IMerchantService;
import com.biki9933.service.ITableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 桌号Controller
 */
@RestController
@RequestMapping("/table")
public class TableController {

    @Autowired
    private ITableService tableService;

    @Autowired
    private IMerchantService merchantService;

    /**
     * 扫码获取桌号和商户信息
     */
    @GetMapping("/scan")
    public R scan(@RequestParam String number) {
        Table table = tableService.getOne(new QueryWrapper<Table>().eq("number", number));
        if (table == null) {
            return R.error("无效的桌号");
        }
        
        Merchant merchant = merchantService.findById(table.getMerchantId());
        if (merchant == null) {
            return R.error("商户信息不存在");
        }
        
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("table", table);
        resultMap.put("merchant", merchant);
        return R.ok(resultMap);
    }

    /**
     * 获取桌号信息
     */
    @GetMapping("/info")
    public R info(@RequestParam Integer merchantId,
                 @RequestParam String number) {
        Table table = tableService.getOne(new QueryWrapper<Table>()
                .eq("merchant_id", merchantId)
                .eq("number", number));
                
        if (table == null) {
            return R.error("桌号不存在");
        }
        
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("table", table);
        return R.ok(resultMap);
    }
} 