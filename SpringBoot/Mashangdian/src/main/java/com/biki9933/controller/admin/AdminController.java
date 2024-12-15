package com.biki9933.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.biki9933.entity.Admin;
import com.biki9933.entity.Merchant;
import com.biki9933.entity.R;
import com.biki9933.service.IAdminService;
import com.biki9933.service.IMerchantService;
import com.biki9933.util.JwtUtils;
import com.biki9933.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理员Controller
 */
@RestController
@CrossOrigin
public class AdminController {

    @Autowired
    private IAdminService adminService;

    @Autowired
    private IMerchantService merchantService;

    private final static Logger logger = LoggerFactory.getLogger(AdminController.class);

    /**
     * 管理员登录
     */
    @PostMapping("/admin/login")
    public R login(@RequestBody Admin admin) {
        logger.info("管理员登录请求：{}", admin);

        if(admin == null) {
            return R.error("参数错误");
        }
        if(StringUtil.isEmpty(admin.getUserName())) {
            return R.error("用户名不能为空");
        }
        if(StringUtil.isEmpty(admin.getPassword())) {
            return R.error("密码不能为空");
        }
        if(admin.getMerchantId() == null) {
            return R.error("商户ID不能为空");
        }

        // 使用 wrapper 查询，注意字段名要和数据库一致
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", admin.getUserName())  // 数据库字段是 username
                .eq("merchant_id", admin.getMerchantId());

        Admin resultAdmin = adminService.getOne(queryWrapper);

        if(resultAdmin == null) {
            return R.error("管理员不存在");
        }

        if(!resultAdmin.getPassword().equals(admin.getPassword())) {
            return R.error("用户名或密码错误");
        }

        // 获取商户信息
        Merchant merchant = merchantService.findById(resultAdmin.getMerchantId());
        if(merchant == null) {
            return R.error("商户不存在");
        }

        // 生成token
        String token = JwtUtils.createToken(resultAdmin.getId(), resultAdmin.getMerchantId(), true);

        // 构建返回数据
        Map<String, Object> adminInfo = new HashMap<>();
        adminInfo.put("merchantId", merchant.getId());
        adminInfo.put("merchantName", merchant.getMerchantName());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("adminInfo", adminInfo);

        logger.info("管理员登录成功：{}", resultAdmin.getUserName());
        return R.ok("登录成功", data);
    }

    /**
     * 修改密码
     */
    @PostMapping("/admin/modifyPassword")
    public R modifyPassword(@RequestBody Admin admin) {
        if(StringUtil.isEmpty(admin.getUserName())) {
            return R.error("用户名不能为空");
        }
        if(StringUtil.isEmpty(admin.getPassword())) {
            return R.error("新密码不能为空");
        }
        if(admin.getMerchantId() == null) {
            return R.error("商户ID不能为空");
        }
        
        Admin existAdmin = adminService.getOne(new QueryWrapper<Admin>()
                .eq("user_name", admin.getUserName())
                .eq("merchant_id", admin.getMerchantId()));
                
        if(existAdmin == null) {
            return R.error("用户不存在");
        }
        
        existAdmin.setPassword(admin.getPassword());
        adminService.updateById(existAdmin);
        
        return R.ok();
    }
}