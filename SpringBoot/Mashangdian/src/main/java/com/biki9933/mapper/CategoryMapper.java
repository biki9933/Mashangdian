package com.biki9933.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.biki9933.entity.Category;

import java.util.List;
import java.util.Map;


/**
 * 菜单类别Mapper接口
 */
public interface CategoryMapper extends BaseMapper<Category> {

    List<Category> list(Map<String, Object> map);

    Long getTotal(Map<String, Object> map);

    Category findById(Integer id);
}
