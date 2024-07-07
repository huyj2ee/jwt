package com.blogspot.huyj2ee.jwt.jwtutils.models;

import java.io.Serializable;

public class JwtResponseModel implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String accessToken;
  private final String refreshToken;

  public JwtResponseModel(String accessToken, String refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public String getAccessToken() {
    return accessToken;
  }

  public String getRefreshToken() {
    return refreshToken;
  }
}