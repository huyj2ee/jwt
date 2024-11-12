package com.blogspot.huyj2ee.jwt.jwtutils.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.Attempts;

@Repository
public interface AttemptsRepository extends JpaRepository<Attempts, Integer> {
  Optional<Attempts> findByUsername(String username);
}