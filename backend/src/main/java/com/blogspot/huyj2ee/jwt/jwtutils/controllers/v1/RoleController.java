package com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogspot.huyj2ee.jwt.jwtutils.annotations.AccessDeniedMessage;
import com.blogspot.huyj2ee.jwt.jwtutils.exceptions.NotFoundException;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.Role;
import com.blogspot.huyj2ee.jwt.jwtutils.models.jpa.User;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.RoleRepository;
import com.blogspot.huyj2ee.jwt.jwtutils.repositories.UserRepository;

@RestController
@CrossOrigin
@PreAuthorize("hasRole('ROLE_admin')")
@RequestMapping(path = "${jwtPrefix}/v1")
public class RoleController {
  @Autowired
  private RoleRepository roleRepository;

  @Autowired
  private UserRepository userRepository;

  @GetMapping("/roles")
  @AccessDeniedMessage("Admin role is required to get all roles list.")
  public ResponseEntity<List<Role>> getAll() throws Exception {
    List<Role> roles = roleRepository.findAll();
    return ResponseEntity.ok(roles);
  }

  @GetMapping("/users/{username}/roles")
  @AccessDeniedMessage("Admin role is required to get assigned roles list.")
  public ResponseEntity<List<Role>> getAssigned(
    @PathVariable("username") String username
  ) throws Exception {
    User user = userRepository.findByUsername(username).orElseThrow(
      () -> new NotFoundException(
        String.format("User with username %s is not found.", username)
      )
    );
    return ResponseEntity.ok(user.getRoles().stream().collect(Collectors.toList()));
  }

  @PutMapping("/users/{username}/roles/{role}")
  @AccessDeniedMessage("Admin role is required to assign role.")
  public ResponseEntity<Role> assign(
    @PathVariable("username") String username,
    @PathVariable("role") String role
  ) throws Exception {
    User user = userRepository.findByUsername(username).orElseThrow(
      () -> new NotFoundException(
        String.format("Username %s is not found.", username)
      )
    );
    Role roleObj = roleRepository.findById(role).orElseThrow(
      () -> new NotFoundException(
        String.format("Role %s is not found.", role)
      )
    );
    user.getRoles().add(roleObj);
    userRepository.save(user);
    return ResponseEntity.ok(roleObj);
  }

  @DeleteMapping("/users/{username}/roles/{role}")
  @AccessDeniedMessage("Admin role is required to revoke role.")
  public ResponseEntity<?> revoke(
    @PathVariable("username") String username,
    @PathVariable("role") String role
  ) throws Exception {
    User user = userRepository.findByUsername(username).orElseThrow(
      () -> new NotFoundException(
        String.format("Username %s is not found.", username)
      )
    );
    Role roleObj = roleRepository.findById(role).orElseThrow(
      () -> new NotFoundException(
        String.format("Role %s is not found.", role)
      )
    );
    if (!user.getRoles().contains(roleObj)) {
      throw new BadRequestException(
        String.format("Role %s is not an assigned role of user.", role)
      );
    }
    user.getRoles().remove(roleObj);
    userRepository.save(user);
    return ResponseEntity.noContent().build();
  }
}
