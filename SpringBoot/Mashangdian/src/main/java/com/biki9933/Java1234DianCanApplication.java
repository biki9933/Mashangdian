package com.biki9933;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.biki9933.mapper")
public class Java1234DianCanApplication {

    public static void main(String[] args) {
        SpringApplication.run(Java1234DianCanApplication.class, args);
    }

}
