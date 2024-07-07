package com.blogspot.huyj2ee.jwt.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
  @Id
  private String username;

  private String password;

  @Column(name = "account_non_locked")
  private boolean accountNonLocked;

  @OneToOne(
    mappedBy = "user",
    orphanRemoval = true,
    cascade = {CascadeType.ALL}
  )
  private RefreshToken refreshToken;

  public User() {
  }

  public User(String username, String password, boolean accountNonLocked) {
    this.username = username;
    this.password = password;
    this.accountNonLocked = accountNonLocked;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public void setAccountNonLocked(Boolean accountNonLocked) {
    this.accountNonLocked = accountNonLocked;
  }

  public boolean getAccountNonLocked() {
    return accountNonLocked;
  }

  public RefreshToken getRefreshToken() {
    return this.refreshToken;
  }

  public void setRefreshToken(RefreshToken refreshToken) {
    this.refreshToken = refreshToken;
  }
}