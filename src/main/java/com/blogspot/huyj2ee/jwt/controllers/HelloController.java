package com.blogspot.huyj2ee.jwt.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("isAuthenticated()")
public class HelloController {
  @GetMapping("/hello")
  public String hello() {
    return "hello";
  }
}