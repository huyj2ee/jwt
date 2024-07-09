package com.blogspot.huyj2ee.jwt.jwtutils.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

@Entity
@Table(name = "roles")
public class Role {
  @Id
  private String role;

  public String getRole() {
    return this.role;
  }

  public void setRole(String role) {
    this.role = role;
  }
}
