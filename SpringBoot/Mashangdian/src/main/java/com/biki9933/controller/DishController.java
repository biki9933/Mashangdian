package com.biki9933.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.biki9933.entity.Category;
import com.biki9933.entity.Dish;
import com.biki9933.entity.R;
import com.biki9933.service.ICategoryService;
import com.biki9933.service.IDishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 菜品控制器
 */
@RestController
@RequestMapping("/dish")
public class DishController {

    @Autowired
    private IDishService dishService;

    @Autowired
    private ICategoryService categoryService;

    /**
     * 获取商户的所有菜品分类和菜品
     */
    @GetMapping("/listAll")
    public R listAll(@RequestParam Integer merchantId) {
        // 获取商户的所有分类
        List<Category> categoryList = categoryService.list(new QueryWrapper<Category>()
                .eq("merchant_id", merchantId)
                .orderByAsc("sort"));
                
        // 获取每个分类下的菜品并转换数据结构
        List<Map<String, Object>> formattedList = new ArrayList<>();
        for(Category category : categoryList){
            Map<String, Object> categoryMap = new HashMap<>();
            categoryMap.put("cid", "CAT" + category.getId());
            categoryMap.put("value", category.getName());
            categoryMap.put("sele_quantity", 0);
            
            List<Dish> dishList = dishService.list(new QueryWrapper<Dish>()
                    .eq("merchant_id", merchantId)
                    .eq("typeId", category.getId())
                    .eq("onsale", true)
                    .orderByDesc("monthlysale"));
                    
            // 转换菜品数据结构
            List<Map<String, Object>> formattedDishList = new ArrayList<>();
            for(Dish dish : dishList) {
                Map<String, Object> dishMap = new HashMap<>();
                dishMap.put("id", dish.getId());
                dishMap.put("name", dish.getName());
                dishMap.put("image", dish.getImage());
                dishMap.put("unitprice", dish.getUnitprice());
                dishMap.put("unit", dish.getUnit());
                dishMap.put("monthlysale", dish.getMonthlysale());
                dishMap.put("quantity", 0);
                formattedDishList.add(dishMap);
            }
            
            categoryMap.put("dishList", formattedDishList);
            formattedList.add(categoryMap);
        }
        
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("categoryList", formattedList);
        return R.ok(resultMap);
    }

    /**
     * 获取菜品详情
     */
    @GetMapping("/detail/{id}")
    public R detail(@RequestParam Integer merchantId,
                   @PathVariable Integer id) {
        Dish dish = dishService.getOne(new QueryWrapper<Dish>()
                .eq("merchant_id", merchantId)
                .eq("id", id));
                
        if (dish == null) {
            return R.error("菜品不存在");
        }
        
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("dish", dish);
        return R.ok(resultMap);
    }

    /**
     * 根据分类获取菜品列表
     */
    @GetMapping("/listByCategory")
    public R listByCategory(@RequestParam Integer merchantId,
                          @RequestParam Integer categoryId) {
        List<Dish> dishList = dishService.list(new QueryWrapper<Dish>()
                .eq("merchant_id", merchantId)
                .eq("typeId", categoryId)
                .eq("onsale", true)
                .orderByDesc("monthlysale"));
                
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("dishList", dishList);
        return R.ok(resultMap);
    }
}
