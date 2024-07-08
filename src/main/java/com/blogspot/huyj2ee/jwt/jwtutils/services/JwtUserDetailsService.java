package com.blogspot.huyj2ee.jwt.jwtutils.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.blogspot.huyj2ee.jwt.jwtutils.models.UserPrincipal;
import com.blogspot.huyj2ee.jwt.jwtutils.models.User;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.UserRepository;

@Service
public class JwtUserDetailsService implements UserDetailsService {
  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("User not present"));
    return new UserPrincipal(user);
  }

  public void createUser(User user) {
    userRepository.save(user);
  }
}