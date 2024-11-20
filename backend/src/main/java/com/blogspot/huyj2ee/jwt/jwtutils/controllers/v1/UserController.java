package com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserRequestResponse;
import com.blogspot.huyj2ee.jwt.jwtutils.annotations.AccessDeniedMessage;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;
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
  @AccessDeniedMessage("Admin role is required to create new user.")
  public ResponseEntity<UserRequestResponse> create(@RequestBody UserRequestResponse request) throws Exception {
    if (Boolean.FALSE.equals(request.getAccountNonLocked())) {
      throw new BadRequestException("accountNonLocked must be null or true or not provided.");
    }
    if (
      request.getUsername() == null ||
      request.getPassword() == null ||
      request.getEnabled() == null
    ) {
      throw new BadRequestException("username or password or enable is null.");
    }
    if (userRepository.existsById(request.getUsername())) {
      throw new BadRequestException(
        String.format("username %s already exists.", request.getUsername())
      );
    }
    User user = new User(
      request.getUsername(),
      passwordEncoder.encode(request.getPassword()),
      request.getEnabled(),
      true
    );
    userRepository.save(user);
    request.setPassword(null);
    request.setAccountNonLocked(true);
    return ResponseEntity.ok(request);
  }
}
