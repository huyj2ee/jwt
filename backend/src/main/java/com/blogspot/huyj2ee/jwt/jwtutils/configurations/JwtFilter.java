package com.blogspot.huyj2ee.jwt.jwtutils.configurations;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.FilterChain;
import java.io.IOException;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blogspot.huyj2ee.jwt.jwtutils.models.web.UserPrincipal;
import com.blogspot.huyj2ee.jwt.jwtutils.services.JwtTokenService;
import com.blogspot.huyj2ee.jwt.jwtutils.services.JwtUserDetailsService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;

@Component
public class JwtFilter extends OncePerRequestFilter {
  @Autowired
  private JwtUserDetailsService userDetailsService;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
    throws ServletException, IOException {
    String tokenHeader = request.getHeader("Authorization");
    String username = null;
    String token = null;
    if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
      token = tokenHeader.substring(7);
      try {
        username = jwtTokenService.getUsernameFromToken(token);
      } catch (IllegalArgumentException e) {
        System.out.println("Unable to get JWT Token");
      } catch (ExpiredJwtException e) {
        System.out.println("JWT Token has expired");
      } catch (MalformedJwtException e) {
        System.out.println("Invalid JWT Token");
      } catch (SignatureException e) {
        System.out.println("Invalid JWT Token");
      }
    }
    if (null != username && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserPrincipal userDetails = (UserPrincipal)userDetailsService.loadUserByUsername(username);
      if (!userDetails.isAccountNonLocked()) {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        JwtAuthenticationEntryPoint.printError(request, response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized", "Too many invalid attempts. Account is locked!!");
        return;
      }
      if (!userDetails.isEnabled()) {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        JwtAuthenticationEntryPoint.printError(request, response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized", "Account is disabled.");
        return;
      }
      if (jwtTokenService.validate(token, userDetails)) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
          userDetails, null,
          userDetails.getAuthorities());
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
      }
    }
    filterChain.doFilter(request, response);
   }
}