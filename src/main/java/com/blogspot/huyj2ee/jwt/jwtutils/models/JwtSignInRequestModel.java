package com.blogspot.huyj2ee.jwt.jwtutils.models;

import java.io.Serializable;

public class JwtSignInRequestModel implements Serializable {
  private static final long serialVersionUID = 2636936156391265891L;
  private String username;
  private String password;

  public JwtSignInRequestModel() {
  }

  public JwtSignInRequestModel(String username, String password) {
    super();
    this.username = username;
    this.password = password;
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
}