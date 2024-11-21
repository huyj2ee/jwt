package com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogspot.huyj2ee.jwt.jwtutils.annotations.AccessDeniedMessage;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.Role;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.RoleRepository;

@RestController
@CrossOrigin
@PreAuthorize("hasRole('ROLE_admin')")
@RequestMapping(path = "${jwtPrefix}/v1")
public class RoleController {
  @Autowired
  private RoleRepository roleRepository;

  @GetMapping("/roles")
  @AccessDeniedMessage("Admin role is required to get all roles list.")
  public ResponseEntity<List<Role>> getAll() throws Exception {
    List<Role> roles = roleRepository.findAll();
    return ResponseEntity.ok(roles);
  }
}
