package com.biki9933.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.biki9933.entity.Unit;
import com.biki9933.mapper.UnitMapper;
import com.biki9933.service.IUnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * 菜品单位Service实现类
 */
@Service("unitService")
public class IUnitServiceImpl extends ServiceImpl<UnitMapper,Unit> implements IUnitService {

    @Autowired
    private UnitMapper unitMapper;

}
