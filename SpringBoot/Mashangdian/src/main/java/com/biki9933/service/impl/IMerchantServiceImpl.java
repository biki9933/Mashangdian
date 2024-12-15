package com.biki9933.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.biki9933.entity.Merchant;
import com.biki9933.mapper.MerchantMapper;
import com.biki9933.service.IMerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 商户Service实现类
 */
@Service("merchantService")
public class IMerchantServiceImpl extends ServiceImpl<MerchantMapper, Merchant> implements IMerchantService {

    @Autowired
    private MerchantMapper merchantMapper;

    @Override
    public List<Merchant> list(Map<String, Object> map) {
        return merchantMapper.list(map);
    }

    @Override
    public Long getTotal(Map<String, Object> map) {
        return merchantMapper.getTotal(map);
    }

    @Override
    public Merchant findById(Integer id) {
        return merchantMapper.selectById(id);
    }
} 