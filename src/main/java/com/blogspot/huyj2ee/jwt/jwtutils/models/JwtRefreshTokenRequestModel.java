package com.blogspot.huyj2ee.jwt.jwtutils.models;

import java.io.Serializable;

public class JwtRefreshTokenRequestModel implements Serializable {
  private static final long serialVersionUID = 1L;
  private String refreshToken;

  public JwtRefreshTokenRequestModel() {
  }

  public JwtRefreshTokenRequestModel(String refreshToken) {
    super();
    this.refreshToken = refreshToken;
  }

  public String getRefreshToken() {
    return this.refreshToken;
  }

  public void setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
  }
}