package com.blogspot.huyj2ee.jwt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
public class JwtApplication {
  public static void main(String[] args) {
    SpringApplication.run(JwtApplication.class, args);
  }
}
