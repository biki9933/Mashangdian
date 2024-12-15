package com.biki9933.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.biki9933.entity.Admin;


/**
 * 管理员Service接口
 */
public interface IAdminService extends IService<Admin> {

    /**
     * 修改
     * @param admin
     * @return
     */
    public Integer update(Admin admin);

}
