package com.blogspot.huyj2ee.jwt.jwtutils.models.web;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;

public class UserPrincipal implements UserDetails {
  private static final long serialVersionUID = 1L;

  private User user;

  public UserPrincipal(User user) {
    this.user = user;
  }

  public User getUser() {
    return this.user;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return this.user.getRoles().stream().map(
      role -> new SimpleGrantedAuthority("ROLE_" + role.getRole())
    ).collect(Collectors.toList());
  }

  @Override
  public String getPassword() {
    return user.getPassword();
  }

  @Override
  public String getUsername() {
    return user.getUsername();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return user.getAccountNonLocked();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return user.getEnabled();
  }
}
