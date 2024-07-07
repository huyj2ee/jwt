package com.blogspot.huyj2ee.jwt.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.blogspot.huyj2ee.jwt.jwtutils.JwtUserDetailsService;
import com.blogspot.huyj2ee.jwt.model.User;

@Controller
public class RegisterController {
  @Autowired
  private JwtUserDetailsService userDetailsManager;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @GetMapping("/register")
  public String register() {
    return "register";
  }

  @PostMapping(
    value = "/register",
    consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = {
    MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE }
  )
  public void addUser(@RequestParam Map<String, String> body) {
    User user = new User();
    user.setUsername(body.get("username"));
    user.setPassword(passwordEncoder.encode(body.get("password")));
    user.setAccountNonLocked(true);
    userDetailsManager.createUser(user);
  }
}
