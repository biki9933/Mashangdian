package com.biki9933.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.biki9933.entity.Dish;
import com.biki9933.entity.PageBean;
import com.biki9933.entity.R;
import com.biki9933.service.IDishService;
import com.biki9933.util.DateUtil;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/admin/dish")
public class AdminDishController {

    @Autowired
    private IDishService dishService;

    @Value("${dishImgsFilePath}")
    private String dishImgsFilePath;

    /**
     * 分页显示
     * @param pageBean
     * @return
     */
    @RequestMapping("/list")
    public R list(@RequestBody PageBean pageBean){
        try {
            System.out.println(pageBean);
            Map<String,Object> map = new HashMap<>();
            map.put("start", Math.max(0, pageBean.getStart()));
            map.put("pageSize", Math.max(1, pageBean.getPageSize()));
            map.put("merchantId", pageBean.getMerchantId());
            
            List<Dish> list = dishService.list(map);
            Long total = dishService.getTotal(map);
            
            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("dishList", list);
            resultMap.put("total", total);
            return R.ok(resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取菜品列表失败：" + e.getMessage());
        }
    }

    /**
     * 添加或者更新
     * @param dish
     * @return
     */
    @PostMapping("/save")
    public R save(@RequestBody Dish dish){
        dish.setTime(new Date());
        if(dish.getId()!=null){
            dishService.updateById(dish);
        }else{
            dish.setOnsale(true);
            dishService.save(dish);
        }
        return R.ok();
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @DeleteMapping("/delete")
    public R delete(Integer id, Integer merchantId){
        try {
            // 验证菜品是否存在且属于该商户
            Dish dish = dishService.getOne(new QueryWrapper<Dish>()
                    .eq("id", id)
                    .eq("merchant_id", merchantId));
            
            if(dish == null) {
                return R.error("菜品不存在或不属于该商户");
            }
            
            dishService.removeById(id);
            return R.ok();
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("删除菜品失败：" + e.getMessage());
        }
    }

    /**
     * 更新上架 下架 状态
     * @return
     */
    @PostMapping("/updateOnSale")
    public R updateOnSale(@RequestBody Dish dish){
        try {
            // 验证菜品是否存在且属于该商户
            Dish d = dishService.getOne(new QueryWrapper<Dish>()
                    .eq("id", dish.getId())
                    .eq("merchant_id", dish.getMerchantId()));
            
            if(d == null) {
                return R.error("菜品不存在或不属于该商户");
            }
            
            d.setOnsale(dish.isOnsale());
            dishService.updateById(d);
            return R.ok();
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("更新菜品状态失败：" + e.getMessage());
        }
    }

    /**
     * 上传菜品图片
     * @param file
     * @return
     * @throws Exception
     */
    @RequestMapping("/uploadImage")
    public Map<String,Object> uploadImage(MultipartFile file)throws Exception{
        Map<String,Object> map=new HashMap<String,Object>();
        if(!file.isEmpty()){
            // 获取文件名
            String fileName = file.getOriginalFilename();
            // 获取文件的后缀名
            String suffixName = fileName.substring(fileName.lastIndexOf("."));
            String newFileName= DateUtil.getCurrentDateStr()+suffixName;

            FileUtils.copyInputStreamToFile(file.getInputStream(), new File(dishImgsFilePath+newFileName));
            map.put("code", 0);
            map.put("msg", "上传成功");
            Map<String,Object> map2=new HashMap<String,Object>();
            map2.put("imageName", newFileName);
            map2.put("src", "/image/dish/"+newFileName);
            map.put("data", map2);
        }
        return map;
    }

    /**
     * 获取菜品销售统计
     * @return
     */
@GetMapping("/sales")
public R getDishSales(@RequestParam Integer merchantId) {
    try {
        List<Map<String, Object>> salesData = dishService.getDishSalesStatistics(merchantId);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("salesData", salesData);
        return R.ok(resultMap);
    } catch (Exception e) {
        e.printStackTrace();
        return R.error("获取菜品销售统计失败");
    }
}

}
