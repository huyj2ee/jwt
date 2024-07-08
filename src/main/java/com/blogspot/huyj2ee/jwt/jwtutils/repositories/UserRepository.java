package com.blogspot.huyj2ee.jwt.jwtutils.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blogspot.huyj2ee.jwt.jwtutils.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
  Optional<User> findByUsername(String username);
}