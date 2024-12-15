package com.biki9933.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.biki9933.entity.PageBean;
import com.biki9933.entity.R;
import com.biki9933.entity.Table;
import com.biki9933.properties.WeixinProperties;
import com.biki9933.service.ITableService;
import com.biki9933.util.DateUtil;
import com.biki9933.util.HttpClientUtil;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/admin/table")
public class AdminTableController {

    @Autowired
    private ITableService tableService;

    @Autowired
    private WeixinProperties weixinProperties;

    @Autowired
    HttpClientUtil httpClientUtil;

    @Value("${qrcodeImgsFilePath}")
    private String qrcodeImgsFilePath;

    /**
     * 添加
     * @param table
     * @return
     */
    @PostMapping("/add")
    public R add(@RequestBody Table table){
        try {
            if(table.getNumber() == null || table.getNumber().trim().isEmpty()) {
                return R.error("桌号不能为空");
            }
            
            // 检查桌号是否已存在
            if(tableService.getByNumber(table.getNumber()) != null) {
                return R.error("该桌号已存在");
            }
            
            // 设置默认值
            table.setStatus(1); // 默认空闲
            table.setCreateTime(new Date());
            
            String accessToken = this.getAccessToken();
            if(accessToken == null) {
                return R.error("获取微信access_token失败");
            }
            
            String qrcode = genQrCodeImage(accessToken, table.getNumber());
            if(qrcode == null) {
                return R.error("生成二维码失败");
            }
            
            table.setQrcode(qrcode);
            tableService.save(table);
            return R.ok();
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("添加餐桌失败：" + e.getMessage());
        }
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    public R delete(@PathVariable Integer id){
        try {
            Table table = tableService.getById(id);
            if(table == null) {
                return R.error("餐桌不存在");
            }
            
            // 删除关联的二维码图片
            if(table.getQrcode() != null) {
                File qrcodeFile = new File(qrcodeImgsFilePath + table.getQrcode());
                if(qrcodeFile.exists()) {
                    qrcodeFile.delete();
                }
            }
            
            tableService.removeById(id);
            return R.ok();
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("删除餐桌失败：" + e.getMessage());
        }
    }

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
            map.put("start", pageBean.getStart());
            map.put("pageSize", pageBean.getPageSize());
            map.put("merchantId", pageBean.getMerchantId());
            List<Table> list = tableService.list(map);
            Long total = tableService.getTotal(map);
            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("tableList", list);
            resultMap.put("total", total);
            return R.ok(resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("获取桌号列表失败：" + e.getMessage());
        }
    }

    /**
     * 更新桌号
     * @param table
     * @return
     */
    @PostMapping("/update")
    public R update(@RequestBody Table table){
        try {
            if(table.getNumber() == null || table.getNumber().trim().isEmpty()) {
                return R.error("桌号不能为空");
            }
            
            // 检查桌号是否已存在（排除自身）
            Table existingTable = tableService.getByNumber(table.getNumber());
            if(existingTable != null && !existingTable.getId().equals(table.getId())) {
                return R.error("该桌号已存在");
            }
            
            tableService.updateById(table);
            return R.ok();
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("更新餐桌失败：" + e.getMessage());
        }
    }

    /**
     * 重新生成二维码
     * @param table
     * @return
     */
    @PostMapping("/qrcode")
    public R generateQrcode(@RequestBody Table table){
        try {
            if(table.getId() == null) {
                return R.error("桌号ID不能为空");
            }
            
            // 获取桌号信息
            Table existingTable = tableService.getById(table.getId());
            if(existingTable == null) {
                return R.error("桌号不存在");
            }
            
            // 获取微信access_token
            String accessToken = this.getAccessToken();
            if(accessToken == null) {
                return R.error("获取微信access_token失败");
            }
            
            // 生成新的二维码
            String qrcode = genQrCodeImage(accessToken, existingTable.getNumber());
            if(qrcode == null) {
                return R.error("生成二维码失败");
            }
            
            // 删除旧的二维码文件
            if(existingTable.getQrcode() != null) {
                File oldQrcodeFile = new File(qrcodeImgsFilePath + existingTable.getQrcode());
                if(oldQrcodeFile.exists()) {
                    oldQrcodeFile.delete();
                }
            }
            
            // 更新数据库中的二维码文件名
            existingTable.setQrcode(qrcode);
            tableService.updateById(existingTable);
            
            return R.ok();
        } catch (Exception e) {
            e.printStackTrace();
            return R.error("重新生成二维码失败：" + e.getMessage());
        }
    }

    private String getAccessToken(){
        try {
            String url="https://api.weixin.qq.com/cgi-bin/token" + "?grant_type=client_credential&appid=" + weixinProperties.getAppid()+ "&secret=" + weixinProperties.getSecret();
            String token = httpClientUtil.sendHttpGet(url);
            JSONObject jsonObject = JSON.parseObject(token);
            if(jsonObject.containsKey("errcode")) {
                throw new RuntimeException("获取access_token失败：" + jsonObject.getString("errmsg"));
            }
            return jsonObject.get("access_token").toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String genQrCodeImage(String accessToken,String table){
        Map<String, Object> body =new HashMap<>();
        body.put("path","pages/index/index?number="+table);
        String url="https://api.weixin.qq.com/wxa/getwxacode?access_token="+accessToken;
        try {
            ByteArrayInputStream bis = new ByteArrayInputStream(getWechatQrcodeByHttpClient(url,body));
            BufferedImage image = ImageIO.read(bis);
            String newFileName=table+"_"+DateUtil.getCurrentDateStr()+".png";
            File output = new File(qrcodeImgsFilePath+newFileName);
            ImageIO.write(image, "png", output);
            return newFileName;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private  byte[] getWechatQrcodeByHttpClient(String url, Map<String, Object> body) {
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        HttpPost httpPost = new HttpPost(url);
        try {
            StringEntity entity = new StringEntity(JSONObject.toJSONString(body));
            entity.setContentType("image/png");
            httpPost.setEntity(entity);
            HttpResponse response = httpClient.execute(httpPost);
            try (InputStream inputStream = response.getEntity().getContent();
                 ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[1024];
                int len = -1;
                while ((len = inputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, len);
                }
                return out.toByteArray();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
