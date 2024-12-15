package com.biki9933.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.biki9933.entity.*;
import com.biki9933.service.ICategoryService;
import com.biki9933.service.IDishService;
import com.biki9933.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/category")
public class AdminCategoryController {

    @Autowired
    private ICategoryService categoryService;

    @Autowired
    private IDishService dishService;

    /**
     * 查询所有菜品类别
     * @return
     */
    @RequestMapping("/listAll")
    public R listAll(@RequestParam Integer merchantId){
        try {
            List<Category> list = categoryService.list(new QueryWrapper<Category>()
                    .eq("merchant_id", merchantId));
            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("categoryList", list);
            resultMap.put("total", list.size());
            return R.ok(resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取所有分类失败：" + e.getMessage());
        }
    }

    /**
     * 分页显示
     * @param pageBean
     * @return
     */
    @RequestMapping("/list")
    public R list(@RequestBody PageBean pageBean){
        try {
            System.out.println(pageBean);
            Map<String,Object> map = new HashMap<>();
            int start = Math.max(0, pageBean.getStart());
            int pageSize = Math.max(1, pageBean.getPageSize());
            map.put("start", start);
            map.put("pageSize", pageSize);
            map.put("merchantId", pageBean.getMerchantId());
            List<Category> list = categoryService.list(map);
            Long total = categoryService.getTotal(map);
            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("categoryList", list);
            resultMap.put("total", total);
            return R.ok(resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取分类列表失败：" + e.getMessage());
        }
    }

    /**
     * 添加
     * @param category
     * @return
     */
    @PostMapping("/add")
    public R add(@RequestBody Category category){
        category.setValue(category.getName());
        category.setCid("a"+DateUtil.getCurrentDateStr());
        category.setCount(0);
        categoryService.save(category);
        return R.ok();
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    public R delete(@PathVariable Integer id){
        if(dishService.list(new QueryWrapper<Dish>().eq("typeId",id)).size()>0){
            return R.error("该菜品类目下有菜品，不能删除！");
        }else{
            categoryService.removeById(id);
            return R.ok();
        }
    }

    /**
     * 更新分类
     * @param category
     * @return
     */
    @PostMapping("/update")
    public R update(@RequestBody Category category){
        try {
            category.setValue(category.getName());
            categoryService.updateById(category);
            return R.ok();
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("更新分类失败：" + e.getMessage());
        }
    }

}
