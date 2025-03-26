package com.blogspot.huyj2ee.jwt.jwtutils.models.web;

import java.io.Serializable;

public class TokenResponse implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String username;
  private final String accessToken;

  public TokenResponse(String username, String accessToken) {
    this.username = username;
    this.accessToken = accessToken;
  }

  public String getAccessToken() {
    return accessToken;
  }

  public String getUsername() {
    return username;
  }
}