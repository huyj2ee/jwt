package com.blogspot.huyj2ee.jwt.jwtutils.services;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserPrincipal;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;

@Service
public class JwtTokenService {
  @Value("${accesstoken.validity}")
  public long TOKEN_VALIDITY;

  @Value("${secret}")
  private String jwtSecret;

  private SecretKey getSecretKey() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
  }

  public String generate(UserPrincipal userDetails) {
    return Jwts.builder()
      .claims()
      .subject(userDetails.getUsername())
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY))
      .and()
      .signWith(getSecretKey(), Jwts.SIG.HS512)
      .compact();
  }

  public String getUsernameFromToken(String token) {
    final Claims claims = Jwts.parser()
      .verifyWith(getSecretKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
    return claims.getSubject();
  }

  public Boolean validate(String token, UserPrincipal userDetails) {
    String username = getUsernameFromToken(token);
    Claims claims = Jwts.parser()
      .verifyWith(getSecretKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();    
    Boolean isTokenExpired = claims.getExpiration().before(new Date());
    User user = userDetails.getUser();
    if (user.getLastSignout() != null && user.getLastSignout().isAfter(claims.getIssuedAt().toInstant())) {
      isTokenExpired = true;
    }
    return (username.equals(userDetails.getUsername()) && !isTokenExpired);
  }
}
