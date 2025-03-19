package com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserPrincipal;
import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserRequestResponse;
import com.blogspot.huyj2ee.jwt.jwtutils.annotations.AccessDeniedMessage;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.NotFoundException;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.ProhibitedActionException;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.Attempts;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.AttemptsRepository;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.UserRepository;

@RestController
@CrossOrigin
@PreAuthorize("hasRole('ROLE_admin')")
@RequestMapping(path = "${jwtPrefix}/v1")
public class UserController {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private AttemptsRepository attemptsRepository;

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
    Page<User> userPage = null;
    HttpHeaders headers = new HttpHeaders();
    if (page == null) {
      throw new ProhibitedActionException("Page query parameter is required, access all user list at a time is prohibited.");
    }
    if (page < 0) {
      throw new BadRequestException("Page parameter must not be less than zero.");
    }
    if (accountNonLocked == null) {
      userPage = userRepository.findAll(
        PageRequest.of(page, 20, Sort.by(Sort.Direction.ASC, "username"))
      );
    }
    else {
      userPage = userRepository.findByAccountNonLocked(
        accountNonLocked,
        PageRequest.of(page, 20, Sort.by(Sort.Direction.ASC, "username"))
      );
    }
    List<UserRequestResponse> users = userPage.getContent().stream().map(
      (user) -> {
        UserRequestResponse userResponse = new UserRequestResponse();
        BeanUtils.copyProperties(user, userResponse, "password");
        return userResponse;
      }
    ).collect(Collectors.toList());
    headers.add("Pagination-Count", String.valueOf(userPage.getTotalPages()));
    headers.add("Pagination-Page", String.valueOf(userPage.getNumber()));
    headers.add("Pagination-Limit", String.valueOf(userPage.getSize()));
    return new ResponseEntity<>(users, headers, HttpStatus.OK);
  }

  @GetMapping("/users/{username}")
  @AccessDeniedMessage("Admin role is required to get user.")
  public ResponseEntity<UserRequestResponse> filterByUsername(
    @PathVariable("username") String username
  ) throws Exception {
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
  ) throws Exception {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
    if (!userRepository.existsById(username)) {
      throw new NotFoundException(
        String.format("User %s is not found.", username)
      );
    }
    if (userDetails.getUsername().equals(username)) {
      throw new BadRequestException("Can not delete signed in user.");
    }
    userRepository.deleteById(username);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/users/{username}")
  @AccessDeniedMessage("Admin role is required to edit user.")
  public ResponseEntity<UserRequestResponse> edit(
    @PathVariable("username") String username,
    @RequestBody UserRequestResponse request
  ) throws Exception {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
    UserRequestResponse result = new UserRequestResponse();
    if (username.compareTo(request.getUsername()) != 0) {
      throw new BadRequestException("Property username is not same with path variable {username}.");
    }
    User user = userRepository.findByUsername(username).orElseThrow(
      () -> new NotFoundException(
        String.format("Username %s is not found.", username)
      )
    );
    if (request.getPassword() != null) {
      user.setPassword(passwordEncoder.encode(request.getPassword()));
    }
    if (request.getEnabled() != null) {
      if (Boolean.FALSE.equals(request.getEnabled()) && userDetails.getUsername().equals(username)) {
        throw new BadRequestException("Can not disable signed in user.");
      }
      user.setEnabled(request.getEnabled());
    }
    if (request.getAccountNonLocked() != null) {
      user.setAccountNonLocked(request.getAccountNonLocked());
    }
    if (Boolean.TRUE.equals(request.getAccountNonLocked())) {
      Attempts attempts = attemptsRepository.findByUsername(username).orElse(null);
      if (attempts != null) {
        attempts.setAttempts(0);
        attemptsRepository.save(attempts);
      }
    }
    userRepository.save(user);
    BeanUtils.copyProperties(user, result, "password");
    return ResponseEntity.ok(result);
  }
}
