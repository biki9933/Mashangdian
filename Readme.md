# Preface

This is a student demo of a mini program for ordering food by scanning QR codes. It does not have a real payment function.
Springboot is used for the back-end, Uniapp for the mini program, and Vue for the back-end management.

## Construct

**Springboot:**

1. src/main/resources/application.yml

```
// configure
qrcodeImgsFilePath: D:\\xxxxxxx\\src\\main\\resources\\static\\qrcode\\
dishImgsFilePath: D:\\xxxxxxx\\src\\main\\resources\\static\\dish\\
```

```
weixin:
  accessTokenUrl: https://api.weixin.qq.com/cgi-bin/token
  appid: xxx
  secret: xxxxx
```

```
// configure your database
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/db_diancan?serverTimezone=Asia/Shanghai
    username: root
    password: 123456
```

**Uniapp:**

HbuilderX ：
follow this

https://blog.csdn.net/m0_56653797/article/details/129520690

rememebr: using your weixin appid 

**Vue :**

Nodejs : version 16

```
// cd target directory
 npm install # install dependence
 npm run serve # start and view it on your terminal
```

