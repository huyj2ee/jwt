package com.blogspot.huyj2ee.jwt.jwtutils.services;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.RefreshTokenException;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.RefreshToken;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.RefreshTokenRepository;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.UserRepository;

@Service
@Transactional
public class RefreshTokenService {
  public static final long TOKEN_VALIDITY = 360 * 60 * 60;

  @Autowired
  private RefreshTokenRepository refreshTokenRepository;

  @Autowired
  private UserRepository userRepository;

  public RefreshToken createRefreshToken(String username) {
    User user = userRepository.findByUsername(username).orElse(null);
    String tokenStr = UUID.randomUUID().toString();
    RefreshToken token = new RefreshToken();

    token.setUser(user);
    token.setIssuedAt(Instant.now());
    token.setExpiration(Instant.now().plusMillis(TOKEN_VALIDITY));

    // Make sure tokenStr is unique
    while (refreshTokenRepository.findByToken(tokenStr).isPresent()) {
      tokenStr = UUID.randomUUID().toString();
    }
    token.setToken(tokenStr);
    if (user != null) {
      user.setRefreshToken(null);
      refreshTokenRepository.deleteByUser(user);
    }
    refreshTokenRepository.save(token);
    return token;
  }

  public Optional<RefreshToken> findByToken(String token) {
    return refreshTokenRepository.findByToken(token);
  }

  public RefreshToken verifyExpiration(RefreshToken token) {
    User user = token.getUser();
    boolean isExpired = user.getLastSignout() != null && user.getLastSignout().isAfter(token.getIssuedAt());
    isExpired = isExpired || token.getExpiration().compareTo(Instant.now()) < 0;
    if (isExpired) {
      refreshTokenRepository.delete(token);
      throw new RefreshTokenException(token.getToken(), "Refresh token was expired. Please make a new sign in request.");
    }
    return token;
  }
}
