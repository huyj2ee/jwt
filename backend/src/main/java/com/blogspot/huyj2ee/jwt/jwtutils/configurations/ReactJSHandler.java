package com.blogspot.huyj2ee.jwt.jwtutils.configurations;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpHeaders;
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
  public ResponseEntity<?> reactJSHandler(NoHandlerFoundException ex, HttpServletRequest request) {
    ClassLoader cl = this.getClass().getClassLoader();
    String path = request.getServletPath();
    MediaType mt = MediaType.TEXT_HTML;
    if (path.endsWith(".js")) {
      mt = new MediaType("application", "javascript");
    }
    else if (path.endsWith(".css")) {
      mt = new MediaType("text", "css");
    }
    else {
      boolean isPng = path.endsWith(".png");
      boolean isJpg = path.endsWith(".jpg");
      boolean isWoff = path.endsWith(".woff");
      boolean isWoff2 = path.endsWith(".woff2");
      if (isPng || isJpg || isWoff || isWoff2) {
        if (isPng) {
          mt = new MediaType("image", "png");
        }
        else if (isJpg) {
          mt = new MediaType("image", "jpeg");
        }
        else if (isWoff) {
          mt = new MediaType("font", "woff");
        }
        else if (isWoff2) {
          mt = new MediaType("font", "woff2");
        }
        InputStream is = cl.getResourceAsStream("/static" + path);
        if (is == null) {
          return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        byte[] bytes = null;
        try {
          bytes = is.readAllBytes();
          is.close();
        }
        catch(IOException e) {
        }
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mt);
        return new ResponseEntity<byte[]>(bytes, headers, HttpStatus.OK);
      }
    }
    String result = "";
    InputStream is = cl.getResourceAsStream("/static" + path);
    if (is == null || path.compareTo("/") == 0) {
      is = cl.getResourceAsStream("/static/index.html");
    }
    try {
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
