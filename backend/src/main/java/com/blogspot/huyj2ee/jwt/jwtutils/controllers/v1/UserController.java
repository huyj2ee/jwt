package com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserRequestResponse;
import com.blogspot.huyj2ee.jwt.jwtutils.annotations.AccessDeniedMessage;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.NotFoundException;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.ProhibitedActionException;
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

  @GetMapping("/users")
  @AccessDeniedMessage("Admin role is required to get user list.")
  public ResponseEntity<List<UserRequestResponse>> browse(
    @RequestParam(value = "page", required = false)
    Integer page,

    @RequestParam(value = "accountNonLocked", required = false)
    Boolean accountNonLocked
  ) throws Exception {
    List<UserRequestResponse> users = null;
    if (page == null) {
      throw new ProhibitedActionException("Page query parameter is required, access all user list at a time is prohibited.");
    }
    if (accountNonLocked == null) {
      users = userRepository.findAll(
        PageRequest.of(page, 20, Sort.by(Sort.Direction.ASC, "username"))
      ).getContent().stream().map(
        (user) -> {
          UserRequestResponse userResponse = new UserRequestResponse();
          BeanUtils.copyProperties(user, userResponse, "password");
          return userResponse;
        }
      ).collect(Collectors.toList());
    }
    else {
      users = userRepository.findByAccountNonLocked(
        accountNonLocked,
        PageRequest.of(page, 20, Sort.by(Sort.Direction.ASC, "username"))
      ).stream().map(
        (user) -> {
          UserRequestResponse userResponse = new UserRequestResponse();
          BeanUtils.copyProperties(user, userResponse, "password");
          return userResponse;
        }
      ).collect(Collectors.toList());
    }
    return ResponseEntity.ok(users);
  }

  @GetMapping("/users/{username}")
  @AccessDeniedMessage("Admin role is required to get user.")
  public ResponseEntity<UserRequestResponse> filterByUsername(
    @PathVariable("username") String username
  ) {
    User user = userRepository.findByUsername(username).orElseThrow(
      () -> new NotFoundException(
        String.format("User with username %s is not found.", username)
      )
    );
    UserRequestResponse userResponse = new UserRequestResponse();
    BeanUtils.copyProperties(user, userResponse, "password");
    return ResponseEntity.ok(userResponse);
  }

  @DeleteMapping("/users/{username}")
  @AccessDeniedMessage("Admin role is required to delete user.")
  public ResponseEntity<?> delete(
    @PathVariable("username") String username
  ) {
    if (!userRepository.existsById(username)) {
      throw new NotFoundException(
        String.format("User %s is not found.", username)
      );
    }
    userRepository.deleteById(username);
    return ResponseEntity.noContent().build();
  }
}
