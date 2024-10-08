package com.blogspot.huyj2ee.jwt.jwtutils;

import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.blogspot.huyj2ee.jwt.jwtutils.models.UserPrincipal;
import com.blogspot.huyj2ee.jwt.jwtutils.models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenManager implements Serializable {
  private static final long serialVersionUID = 7008375124389347049L;

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

  public Boolean validateJwtToken(String token, UserPrincipal userDetails) {
    String username = getUsernameFromToken(token);
    Claims claims = Jwts.parser()
      .verifyWith(getSecretKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();    
    Boolean isTokenExpired = claims.getExpiration().before(new Date());
    User user = userDetails.getUser();
    if (user.getLastLogout() != null && user.getLastLogout().isAfter(claims.getIssuedAt().toInstant())) {
      isTokenExpired = true;
    }
    return (username.equals(userDetails.getUsername()) && !isTokenExpired);
  }

  public String getUsernameFromToken(String token) {
    final Claims claims = Jwts.parser()
      .verifyWith(getSecretKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
    return claims.getSubject();
  }
}