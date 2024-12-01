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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogspot.huyj2ee.jwt.jwtutils.models.web.CredentialRequestResponse;
import com.blogspot.huyj2ee.jwt.jwtutils.models.web.RefreshTokenRequest;
import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserPrincipal;
import com.blogspot.huyj2ee.jwt.jwtutils.models.web.TokenResponse;
import com.blogspot.huyj2ee.jwt.jwtutils.annotations.AccessDeniedMessage;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.ChangePasswordException;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.RefreshTokenException;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.UnexpectedException;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.Attempts;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.RefreshToken;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.AttemptsRepository;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.UserRepository;
import com.blogspot.huyj2ee.jwt.jwtutils.services.JwtTokenService;
import com.blogspot.huyj2ee.jwt.jwtutils.services.RefreshTokenService;

import jakarta.servlet.http.HttpServletResponse;

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
  public ResponseEntity<TokenResponse> signIn(@RequestBody CredentialRequestResponse request) throws Exception {
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
  @AccessDeniedMessage(
    value = "You must sign in to execute sign out operation.",
    status = HttpServletResponse.SC_UNAUTHORIZED
  )
  public ResponseEntity<?> signOut() throws Exception {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
    User user = userDetails.getUser();
    user.setLastSignout(Instant.now());
    userRepository.save(user);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/refreshtoken")
  public ResponseEntity<TokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) throws Exception {
    String refreshToken = request.getRefreshToken();
    RefreshToken refreshTokenObj = refreshTokenService.findByToken(refreshToken).orElseThrow(
      () -> new RefreshTokenException(refreshToken, "Refresh token is not in database.")
    );
    refreshTokenService.verifyExpiration(refreshTokenObj);
    User user = refreshTokenObj.getUser();
    if (!user.getAccountNonLocked()) {
      throw new LockedException("Too many invalid attempts. Account is locked!!");
    }
    if (!user.getEnabled()) {
      throw new DisabledException("Account is disabled.");
    }
    UserPrincipal userDetail = new UserPrincipal(user);
    String token = jwtTokenService.generate(userDetail);

    return ResponseEntity.ok(new TokenResponse(token, refreshToken));
  }

  @PreAuthorize("isAuthenticated()")
  @PutMapping("/password")
  @AccessDeniedMessage(
    value = "You must sign in to execute change password operation.",
    status = HttpServletResponse.SC_UNAUTHORIZED
  )
  public ResponseEntity<CredentialRequestResponse> changePassword(@RequestBody CredentialRequestResponse request) throws Exception {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
    if (userDetails.getUsername().compareTo(request.getUsername()) != 0) {
      throw new ChangePasswordException("Can not change password for other user.");
    }
    User user = userRepository.findByUsername(request.getUsername()).orElseThrow(
      () -> new UnexpectedException("Unexpected Error has occurred.")
    );
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    userRepository.save(user);
    request.setPassword(null);
    return ResponseEntity.ok(request);
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
