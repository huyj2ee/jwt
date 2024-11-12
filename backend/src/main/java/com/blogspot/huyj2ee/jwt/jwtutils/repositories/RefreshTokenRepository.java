package com.blogspot.huyj2ee.jwt.jwtutils.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.RefreshToken;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
  Optional<RefreshToken> findByToken(String token);
  Optional<RefreshToken> findByUser(User user);
  int deleteByUser(User user);
}
