package com.biki9933.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.biki9933.entity.Merchant;
import java.util.List;
import java.util.Map;

/**
 * 商户Mapper接口
 */
public interface MerchantMapper extends BaseMapper<Merchant> {

    List<Merchant> list(Map<String, Object> map);

    Long getTotal(Map<String, Object> map);
} 