package com.blogspot.huyj2ee.jwt.jwtutils.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.Role;

public interface RoleRepository extends JpaRepository<Role, String>  {
}
