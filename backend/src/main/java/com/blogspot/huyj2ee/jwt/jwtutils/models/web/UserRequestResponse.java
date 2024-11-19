package com.blogspot.huyj2ee.jwt.jwtutils.models.web;

public class UserRequestResponse {
  private String username;
  private String password;
  private Boolean enabled;
  private Boolean accountNonLocked;

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return this.password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Boolean getEnabled() {
    return enabled;
  }

  public void setEnabled(Boolean enabled) {
    this.enabled = enabled;
  }

  public void setAccountNonLocked(Boolean accountNonLocked) {
    this.accountNonLocked = accountNonLocked;
  }

  public Boolean getAccountNonLocked() {
    return accountNonLocked;
  }
}