package com.blogspot.huyj2ee.jwt.jwtutils.models;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "refreshtoken")
public class RefreshToken {
  @Id
  @Column(nullable = false, unique = true)
  private String token;

  @Column(nullable = false)
  private Instant expiration;

  @Column(nullable = false)
  private Instant issuedAt;

  @OneToOne
  @JoinColumn(
    name="username",
    nullable = false,
    unique = true,
    referencedColumnName = "username"
  )
  private User user;

  public String getToken() {
    return this.token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public Instant getExpiration() {
    return this.expiration;
  }

  public void setExpiration(Instant expiration) {
    this.expiration = expiration;
  }

  public Instant getIssuedAt() {
    return this.issuedAt;
  }

  public void setIssuedAt(Instant issuedAt) {
    this.issuedAt = issuedAt;
  }

  public User getUser() {
    return this.user;
  }

  public void setUser(User user) {
    this.user = user;
  }
}
