package com.biki9933.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.biki9933.entity.Admin;
import com.biki9933.mapper.AdminMapper;
import com.biki9933.service.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


/**
 * 管理员Service实现类
 */
@Service("adminService")
public class IAdminServiceImpl extends ServiceImpl<AdminMapper,Admin> implements IAdminService {

    @Autowired
    private AdminMapper adminMapper;


    @Override
    public Integer update(Admin admin) {
        return adminMapper.update(admin);
    }
}
