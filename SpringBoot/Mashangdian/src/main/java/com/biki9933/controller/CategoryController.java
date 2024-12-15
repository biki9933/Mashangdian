package com.biki9933.controller;


import com.biki9933.entity.Category;
import com.biki9933.entity.R;
import com.biki9933.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;



@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private ICategoryService categoryService;

    /**
     * 查询所有菜单分类
     * @return
     */
    @RequestMapping("/listAll")
    public R listAll(){
        List<Category> list = categoryService.list();
        Map<String,Object> map=new HashMap<>();
        map.put("categoryListAll",list);
        return R.ok(map);
    }

}
