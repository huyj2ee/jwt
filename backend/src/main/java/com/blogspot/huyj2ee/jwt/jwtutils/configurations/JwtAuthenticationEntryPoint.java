package com.blogspot.huyj2ee.jwt.jwtutils.configurations;

import java.io.IOException;
import java.io.Serializable;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.ZonedDateTime;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint, Serializable {
  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
    throws IOException, ServletException {
    ZonedDateTime ts = ZonedDateTime.now(ZoneId.of("GMT+00:00"));
    String tsStr = ts.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'+00:00'"));
    String path = request.getServletPath();
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType("application/json");
    String formatStr = "{\"timestamp\": \"%s\", \"status\": %d, \"error\": \"Unauthorized\", \"message\": \"%s\", \"path\": \"%s\"}";
    response.getWriter().format(formatStr, tsStr, HttpStatus.UNAUTHORIZED.value(), authException.getMessage(), path);
  }
}