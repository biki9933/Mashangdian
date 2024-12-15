package com.biki9933.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.biki9933.entity.User;
import java.util.List;
import java.util.Map;

/**
 * 用户Mapper接口
 */
public interface UserMapper extends BaseMapper<User> {

    List<User> list(Map<String, Object> map);

    Long getTotal(Map<String, Object> map);
} 