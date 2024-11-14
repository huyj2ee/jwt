package com.blogspot.huyj2ee.jwt.jwtutils.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ChangePasswordException extends RuntimeException{
  private static final long serialVersionUID = 1L;

  public ChangePasswordException(String message) {
    super(message);
  }
}