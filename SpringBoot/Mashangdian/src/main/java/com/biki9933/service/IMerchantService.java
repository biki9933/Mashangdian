package com.biki9933.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.biki9933.entity.Merchant;

import java.util.List;
import java.util.Map;

/**
 * 商户Service接口
 */
public interface IMerchantService extends IService<Merchant> {
    
    /**
     * 根据条件分页查询商户列表
     */
    List<Merchant> list(Map<String, Object> map);
    
    /**
     * 获取总记录数
     */
    Long getTotal(Map<String, Object> map);
    
    /**
     * 根据ID获取商户信息
     */
    Merchant findById(Integer id);
} 