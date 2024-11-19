package com.blogspot.huyj2ee.jwt.jwtutils.models.jpa;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
  @Id
  private String username;

  private String password;

  private boolean enabled;

  @Column(name = "account_non_locked")
  private boolean accountNonLocked;

  @Column(
    name = "last_logout",
    nullable = true
  )
  private Instant lastSignout;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    joinColumns = @JoinColumn(name = "username"),
    inverseJoinColumns = @JoinColumn(name = "role"),
    name = "users_roles"
  )
  private Set<Role> roles;

  @OneToOne(
    mappedBy = "user",
    orphanRemoval = true,
    cascade = {CascadeType.ALL}
  )
  private RefreshToken refreshToken;

  public User() {
    this.roles = new HashSet<Role>();
  }

  public User(String username, String password, boolean enabled, boolean accountNonLocked) {
    this.username = username;
    this.password = password;
    this.enabled = enabled;
    this.accountNonLocked = accountNonLocked;
    this.roles = new HashSet<Role>();
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

  public boolean getEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public void setAccountNonLocked(boolean accountNonLocked) {
    this.accountNonLocked = accountNonLocked;
  }

  public boolean getAccountNonLocked() {
    return accountNonLocked;
  }

  public Instant getLastSignout() {
    return this.lastSignout;
  }

  public void setLastSignout(Instant lastSignout) {
    this.lastSignout = lastSignout;
  }

  public Set<Role> getRoles() {
    return this.roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles.retainAll(roles);
    this.roles.addAll(roles);
  }

  public RefreshToken getRefreshToken() {
    return this.refreshToken;
  }

  public void setRefreshToken(RefreshToken refreshToken) {
    this.refreshToken = refreshToken;
  }
}