package com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogspot.huyj2ee.jwt.jwtutils.models.UserRequestModel;
import com.blogspot.huyj2ee.jwt.jwtutils.models.User;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.UserRepository;

@RestController
@CrossOrigin
@PreAuthorize("hasRole('ROLE_admin')")
@RequestMapping(path = "${jwtPrefix}/v1")
public class UserController {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/users")
  public ResponseEntity<?> register(@RequestBody UserRequestModel request) throws Exception {
    User user = new User();
    user.setUsername(request.getUsername());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setAccountNonLocked(true);
    userRepository.save(user);
    return ResponseEntity.ok("ok");
  }
}
