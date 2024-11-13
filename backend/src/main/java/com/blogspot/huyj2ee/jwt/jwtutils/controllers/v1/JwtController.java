package com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1;

import java.time.Instant;
import java.util.Optional;

import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogspot.huyj2ee.jwt.jwtutils.models.web.CredentialRequestResponse;
import com.blogspot.huyj2ee.jwt.jwtutils.models.web.RefreshTokenRequest;
import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserPrincipal;
import com.blogspot.huyj2ee.jwt.jwtutils.models.web.TokenResponse;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.TokenRefreshException;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.Attempts;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.RefreshToken;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.AttemptsRepository;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.UserRepository;
import com.blogspot.huyj2ee.jwt.jwtutils.services.JwtTokenService;
import com.blogspot.huyj2ee.jwt.jwtutils.services.RefreshTokenService;

@RestController
@CrossOrigin
@RequestMapping(path = "${jwtPrefix}/v1")
public class JwtController {
  private static final int ATTEMPTS_LIMIT = 3;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private AttemptsRepository attemptsRepository;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Autowired
  private RefreshTokenService refreshTokenService;

  @PostMapping("/signin")
  public ResponseEntity<?> signIn(@RequestBody CredentialRequestResponse request) throws Exception {
    final String password = request.getPassword();
    final String username = request.getUsername();
    final User user = userRepository.findByUsername(username).orElseThrow(
      () -> new BadCredentialsException("User not found.")
    );
    final UserPrincipal userDetails = new UserPrincipal(user);
    if (!user.getAccountNonLocked()) {
      throw new LockedException("Too many invalid attempts. Account is locked!!");
    }
    if (!user.getEnabled()) {
      throw new DisabledException("Account is disabled.");
    }
    if (passwordEncoder.matches(password, user.getPassword())) {
      Optional<Attempts> userAttempts = attemptsRepository.findByUsername(username);
      if (userAttempts.isPresent()) {
        Attempts attempts = userAttempts.get();
        attempts.setAttempts(0);
        attemptsRepository.save(attempts);
      }
      RefreshToken refreshToken = refreshTokenService.createRefreshToken(username);
      final String jwtToken = jwtTokenService.generate(userDetails);
      return ResponseEntity.ok(new TokenResponse(jwtToken, refreshToken.getToken()));
    }
    processFailedAttempts(username, user);
    throw new BadCredentialsException("Invalid password.");
  }

  @PreAuthorize("isAuthenticated()")
  @PostMapping("/signout")
  public ResponseEntity<?> signOut() throws Exception {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
    User user = userDetails.getUser();
    user.setLastSignout(Instant.now());
    userRepository.save(user);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/refreshtoken")
  public ResponseEntity<?> refreshtoken(@RequestBody RefreshTokenRequest request) throws Exception {
    String requestRefreshToken = request.getRefreshToken();
    Optional<RefreshToken> refreshToken = refreshTokenService.findByToken(requestRefreshToken);
    if (!refreshToken.isPresent()) {
      throw new TokenRefreshException(requestRefreshToken, "Refresh token is not in database.");
    }
    RefreshToken refreshTokenObj = refreshToken.get();
    User user = refreshTokenObj.getUser();
    if (!user.getAccountNonLocked()) {
      throw new LockedException("Too many invalid attempts. Account is locked!!");
    }
    if (!user.getEnabled()) {
      throw new DisabledException("Account is disabled.");
    }
    refreshTokenService.verifyExpiration(refreshTokenObj);
    UserPrincipal userDetail = new UserPrincipal(user);
    String token = jwtTokenService.generate(userDetail);

    return ResponseEntity.ok(new TokenResponse(token, requestRefreshToken));
  }

  private void processFailedAttempts(String username, User user) {
    Optional<Attempts> userAttempts = attemptsRepository.findByUsername(username);
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
