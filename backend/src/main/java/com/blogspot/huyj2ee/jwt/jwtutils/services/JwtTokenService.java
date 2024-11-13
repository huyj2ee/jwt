package com.blogspot.huyj2ee.jwt.jwtutils.services;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserPrincipal;

@Service
public class JwtTokenService {
  public static final long TOKEN_VALIDITY = 10 * 60 * 60;

  @Value("${secret}")
  private String jwtSecret;

  private SecretKey getSecretKey() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
  }

  public String generateJwtToken(UserPrincipal userDetails) {
    return Jwts.builder()
      .claims()
      .subject(userDetails.getUsername())
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
      .and()
      .signWith(getSecretKey(), Jwts.SIG.HS512)
      .compact();
  }
}