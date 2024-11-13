package com.blogspot.huyj2ee.jwt.jwtutils.models.web;

import java.io.Serializable;

public class RefreshTokenRequest  implements Serializable {
  private static final long serialVersionUID = 1L;
  private String refreshToken;

  public RefreshTokenRequest() {
  }

  public RefreshTokenRequest(String refreshToken) {
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
