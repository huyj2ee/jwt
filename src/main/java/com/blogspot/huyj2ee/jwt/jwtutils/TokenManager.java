package com.blogspot.huyj2ee.jwt.jwtutils;

import java.io.Serializable;
import java.nio.charset.StandardCharsets;
//import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.io.Decoders;
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

  public String generateJwtToken(UserDetails userDetails) {
    /*Map<String, Object> claims = new HashMap<>();
    Jwts.builder().setClaims(claims).setSubject(userDetails.getUsername())
      .setIssuedAt(new Date(System.currentTimeMillis()))
      .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
      .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();*/
    //https://stackoverflow.com/questions/73576686/what-substitute-can-i-use-for-java-springs-jwts-signwith-deprecated-method
    return Jwts.builder()
      .claims()
      .subject(userDetails.getUsername())
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
      .and()
      //.signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)), Jwts.SIG.HS512)
      .signWith(getSecretKey(), Jwts.SIG.HS512)
      .compact();
  }

  public Boolean validateJwtToken(String token, UserDetails userDetails) {
    String username = getUsernameFromToken(token);
    //Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
    //SecretKey secret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    //SecretKey secret = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    Claims claims = Jwts.parser()
      .verifyWith(getSecretKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();    
    Boolean isTokenExpired = claims.getExpiration().before(new Date());
    return (username.equals(userDetails.getUsername()) && !isTokenExpired);
  }

  public String getUsernameFromToken(String token) {
    //final Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
    //return claims.getSubject();
    //https://stackoverflow.com/questions/73486900/how-to-fix-parser-is-deprecated-and-setsigningkeyjava-security-key-is-deprec
    //SecretKey secret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    //SecretKey secret = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    //SecretKey secret2 = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    final Claims claims = Jwts.parser()
      .verifyWith(getSecretKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
    return claims.getSubject();
  }
}