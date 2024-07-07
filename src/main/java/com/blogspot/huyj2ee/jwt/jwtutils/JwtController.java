package com.blogspot.huyj2ee.jwt.jwtutils;

import org.springframework.security.authentication.LockedException;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.blogspot.huyj2ee.jwt.jwtutils.models.JwtRequestModel;
import com.blogspot.huyj2ee.jwt.jwtutils.models.JwtResponseModel;
import com.blogspot.huyj2ee.jwt.model.Attempts;
import com.blogspot.huyj2ee.jwt.model.User;
import com.blogspot.huyj2ee.jwt.repository.AttemptsRepository;
import com.blogspot.huyj2ee.jwt.repository.UserRepository;

@RestController
@CrossOrigin
public class JwtController {
  private static final int ATTEMPTS_LIMIT = 3;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private AttemptsRepository attemptsRepository;

  @Autowired
  private TokenManager tokenManager;

  @PostMapping("/login")
  public ResponseEntity<?> createToken(@RequestBody JwtRequestModel request) throws Exception {
    final String password = request.getPassword();
    final String username = request.getUsername();
    final UserDetails userDetails = userRepository.findUserByUsername(username).orElseThrow(
      () -> new BadCredentialsException("User not found.")
    );
    if (!userDetails.isAccountNonLocked()) {
      throw new LockedException("Too many invalid attempts. Account is locked!!");
    }
    if (passwordEncoder.matches(password, userDetails.getPassword())) {
      Optional<Attempts> userAttempts = attemptsRepository.findAttemptsByUsername(username);
      if (userAttempts.isPresent()) {
        Attempts attempts = userAttempts.get();
        attempts.setAttempts(0);
        attemptsRepository.save(attempts);
      }    
      final String jwtToken = tokenManager.generateJwtToken(userDetails);
      return ResponseEntity.ok(new JwtResponseModel(jwtToken));
    }
    processFailedAttempts(username, (User)userDetails);
    throw new BadCredentialsException("Invalid password.");
  }

  private void processFailedAttempts(String username, User user) {
    Optional<Attempts> userAttempts = attemptsRepository.findAttemptsByUsername(username);
    if (userAttempts.isEmpty()) {
      Attempts attempts = new Attempts();
      attempts.setUsername(username);
      attempts.setAttempts(1);
      attemptsRepository.save(attempts);
    } else {
      Attempts attempts = userAttempts.get();
      attempts.setAttempts(attempts.getAttempts() + 1);
      attemptsRepository.save(attempts);
 
      if (attempts.getAttempts() + 1 > ATTEMPTS_LIMIT) {
        user.setAccountNonLocked(false);
        userRepository.save(user);
        throw new LockedException("Too many invalid attempts. Account is locked!!");
      }
    }
  }
}