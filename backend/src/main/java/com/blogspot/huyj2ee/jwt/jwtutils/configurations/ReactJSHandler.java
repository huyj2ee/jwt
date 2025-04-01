package com.blogspot.huyj2ee.jwt.jwtutils.configurations;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class ReactJSHandler {
  @ExceptionHandler({NoHandlerFoundException.class})
  public ResponseEntity<String> reactJSHandler(NoHandlerFoundException ex, HttpServletRequest request) {
    MediaType mt = MediaType.TEXT_HTML;
    if (request.getServletPath().endsWith(".js")) {
      mt = new MediaType("application", "javascript");
    }
    if (request.getServletPath().endsWith(".css")) {
      mt = new MediaType("text", "css");
    }
    String result = "";
    URL url = this.getClass().getResource("/static" + request.getServletPath());
    if (url == null || request.getServletPath().compareTo("/") == 0) {
      url = this.getClass().getResource("/static/index.html");
    }
    try {
      InputStream is = url.openStream();
      byte[] bytes = is.readAllBytes();
      result = new String(bytes, StandardCharsets.UTF_8);
      is.close();
    }
    catch(IOException e) {
      result = "IOException";
    }
    return ResponseEntity.status(HttpStatus.OK).contentType(mt).body(result);
  }
}
