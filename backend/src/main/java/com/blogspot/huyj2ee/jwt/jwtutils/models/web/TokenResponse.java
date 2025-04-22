package com.blogspot.huyj2ee.jwt.jwtutils.models.web;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.Role;

public class TokenResponse implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String username;
  private final String accessToken;
  private final Set<String> roles;

  public TokenResponse(String username, String accessToken, Set<Role> roles) {
    this.username = username;
    this.accessToken = accessToken;
    this.roles = new HashSet<String>();
    for (Role role : roles) {
      String rolestr = new String(role.getRole());
      this.roles.add(rolestr);
    }
  }

  public String getAccessToken() {
    return accessToken;
  }

  public String getUsername() {
    return username;
  }

  public Set<String> getRoles() {
    return roles;
  }
}
