package com.hungrezy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HungrezyApplication {
    public static void main(String[] args) {
        SpringApplication.run(HungrezyApplication.class, args);
        System.out.println("Hungrezy Server Running on port 8080");
    }
}
