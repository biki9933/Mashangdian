package com.biki9933.entity;

import java.math.BigDecimal;

/**
 * 销售统计实体类
 */
public class SalesVolume {
    private String time;           // 统计时间
    private BigDecimal salesVolume; // 销售额

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public BigDecimal getSalesVolume() {
        return salesVolume;
    }

    public void setSalesVolume(BigDecimal salesVolume) {
        this.salesVolume = salesVolume;
    }
}
