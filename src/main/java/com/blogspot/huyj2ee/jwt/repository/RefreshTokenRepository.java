package com.blogspot.huyj2ee.jwt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blogspot.huyj2ee.jwt.model.RefreshToken;
import com.blogspot.huyj2ee.jwt.model.User;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
  Optional<RefreshToken> findByToken(String token);
  Optional<RefreshToken> findByUser(User user);
  int deleteByUser(User user);
}
