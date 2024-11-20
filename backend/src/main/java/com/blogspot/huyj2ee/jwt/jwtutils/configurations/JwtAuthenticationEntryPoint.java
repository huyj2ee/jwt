package com.blogspot.huyj2ee.jwt.jwtutils.configurations;

import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.blogspot.huyj2ee.jwt.jwtutils.annotations.AccessDeniedMessage;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@ControllerAdvice
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint, Serializable {
  private static final String controllerPackageScan = "com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1";
  private Map<String, Map<String, String>> methodsMap;

  public JwtAuthenticationEntryPoint() {
    this.methodsMap = new HashMap<String, Map<String, String>>();
  }

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
    throws IOException, ServletException {
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType("application/json");
    printError(request, response, HttpStatus.UNAUTHORIZED.value(), "Unauthorized", authException.getMessage());
  }

  @ExceptionHandler(value = { AccessDeniedException.class })
  public void commence(HttpServletRequest request, HttpServletResponse response, AccessDeniedException ex ) throws IOException {
    response.setContentType("application/json");
    response.setStatus(HttpStatus.FORBIDDEN.value());

    StackTraceElement[] sts = ex.getStackTrace();
    int len = sts.length;
    for(int i=0; i<len; i++) {
      StackTraceElement st = sts[i];
      String className = st.getClassName();
      if (className.startsWith(controllerPackageScan)) {
        int lastIndex = className.indexOf("$$");
        String controllerClassName = className.substring(0, lastIndex);
        String methodName = st.getMethodName();
        Map<String, String> msgMap = this.methodsMap.get(controllerClassName);
        if (msgMap == null) {
          msgMap = new HashMap<String, String>();
          this.methodsMap.put(controllerClassName, msgMap);
        }
        String msg = msgMap.get(methodName);
        if (msg == null) {
          msg = "Access denied.";
          try {
            Class<?> controllerClass = Class.forName(controllerClassName);
            Method[] methods = controllerClass.getMethods();
            int methodsCount = methods.length;
            for (int j=0; j<methodsCount; j++) {
              Method method = methods[j];
              if (method.getName().compareTo(methodName) == 0) {
                msg = method.getAnnotation(AccessDeniedMessage.class).value();
                break;
              }
            }
          } catch (Exception e) {
            e.printStackTrace();
          }
          msgMap.put(methodName, msg);
        }
        printError(request, response, HttpStatus.FORBIDDEN.value(), "Forbidden", msg);
        break;
      }
    }
  }

  private void printError(HttpServletRequest request, HttpServletResponse response, int status, String error, String msg)
    throws IOException {
    final String formatStr = "{\"timestamp\": \"%s\", \"status\": %d, \"error\": \"%s\", \"message\": \"%s\", \"path\": \"%s\"}";
    ZonedDateTime ts = ZonedDateTime.now(ZoneId.of("GMT+00:00"));
    String tsStr = ts.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'+00:00'"));
    String path = request.getServletPath();
    response.getWriter().format(formatStr, tsStr, status, error, msg, path);
  }
}