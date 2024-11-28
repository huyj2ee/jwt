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
  private class AccessDeniedResponse {
    private String message;
    private int status;

    public AccessDeniedResponse(String message, int status) {
      this.message = message;
      this.status = status;
    }

    public String getMessage() {
      return this.message;
    }

    public int getStatus() {
      return this.status;
    }
  }

  private static final String controllerPackageScan = "com.blogspot.huyj2ee.jwt.jwtutils.controllers.v1";
  private Map<String, Map<String, AccessDeniedResponse>> methodsMap;
  private Map<Integer, String> errorsMap;

  public JwtAuthenticationEntryPoint() {
    this.methodsMap = new HashMap<String, Map<String, AccessDeniedResponse>>();
    this.errorsMap = new HashMap<Integer, String>();

    this.errorsMap.put(HttpServletResponse.SC_CONTINUE, "Continue");
    this.errorsMap.put(HttpServletResponse.SC_SWITCHING_PROTOCOLS, "Switching protocols");
    this.errorsMap.put(HttpServletResponse.SC_OK, "Ok");
    this.errorsMap.put(HttpServletResponse.SC_CREATED, "Created");
    this.errorsMap.put(HttpServletResponse.SC_ACCEPTED, "Accepted");
    this.errorsMap.put(HttpServletResponse.SC_NON_AUTHORITATIVE_INFORMATION, "None authoritative information");
    this.errorsMap.put(HttpServletResponse.SC_NO_CONTENT, "No content");
    this.errorsMap.put(HttpServletResponse.SC_RESET_CONTENT, "Reset content");
    this.errorsMap.put(HttpServletResponse.SC_PARTIAL_CONTENT, "Partial content");
    this.errorsMap.put(HttpServletResponse.SC_MULTIPLE_CHOICES, "Multiple choices");
    this.errorsMap.put(HttpServletResponse.SC_MOVED_PERMANENTLY, "Moved permanently");
    this.errorsMap.put(HttpServletResponse.SC_MOVED_TEMPORARILY, "Moved temporarily");
    this.errorsMap.put(HttpServletResponse.SC_FOUND, "Found");
    this.errorsMap.put(HttpServletResponse.SC_SEE_OTHER, "See other");
    this.errorsMap.put(HttpServletResponse.SC_NOT_MODIFIED, "Not modified");
    this.errorsMap.put(HttpServletResponse.SC_USE_PROXY, "Use proxy");
    this.errorsMap.put(HttpServletResponse.SC_TEMPORARY_REDIRECT, "Temporary redirect");
    this.errorsMap.put(HttpServletResponse.SC_BAD_REQUEST, "Bad request");
    this.errorsMap.put(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    this.errorsMap.put(HttpServletResponse.SC_PAYMENT_REQUIRED, "Payment required");
    this.errorsMap.put(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
    this.errorsMap.put(HttpServletResponse.SC_NOT_FOUND, "Not found");
    this.errorsMap.put(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "Method not allowed");
    this.errorsMap.put(HttpServletResponse.SC_NOT_ACCEPTABLE, "Not acceptable");
    this.errorsMap.put(HttpServletResponse.SC_PROXY_AUTHENTICATION_REQUIRED, "Proxy authentication required");
    this.errorsMap.put(HttpServletResponse.SC_REQUEST_TIMEOUT, "Request timeout");
    this.errorsMap.put(HttpServletResponse.SC_CONFLICT, "Conflict");
    this.errorsMap.put(HttpServletResponse.SC_GONE, "Gone");
    this.errorsMap.put(HttpServletResponse.SC_LENGTH_REQUIRED, "Length required");
    this.errorsMap.put(HttpServletResponse.SC_PRECONDITION_FAILED, "Precondition failed");
    this.errorsMap.put(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE, "Request entity too large");
    this.errorsMap.put(HttpServletResponse.SC_REQUEST_URI_TOO_LONG, "Request uri too long");
    this.errorsMap.put(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, "Unsupported media type");
    this.errorsMap.put(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE, "Requested range not satisfiable");
    this.errorsMap.put(HttpServletResponse.SC_EXPECTATION_FAILED, "Expectation failed");
    this.errorsMap.put(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error");
    this.errorsMap.put(HttpServletResponse.SC_NOT_IMPLEMENTED, "Not implemented");
    this.errorsMap.put(HttpServletResponse.SC_BAD_GATEWAY, "Bad gateway");
    this.errorsMap.put(HttpServletResponse.SC_SERVICE_UNAVAILABLE, "Service unavailable");
    this.errorsMap.put(HttpServletResponse.SC_GATEWAY_TIMEOUT, "Gateway timeout");
    this.errorsMap.put(HttpServletResponse.SC_HTTP_VERSION_NOT_SUPPORTED, "Http version not supported");
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
        Map<String, AccessDeniedResponse> msgMap = this.methodsMap.get(controllerClassName);
        if (msgMap == null) {
          msgMap = new HashMap<String, AccessDeniedResponse>();
          this.methodsMap.put(controllerClassName, msgMap);
        }
        AccessDeniedResponse msg = msgMap.get(methodName);
        if (msg == null) {
          msg = new AccessDeniedResponse("Forbidden", HttpServletResponse.SC_FORBIDDEN);
          try {
            Class<?> controllerClass = Class.forName(controllerClassName);
            Method[] methods = controllerClass.getMethods();
            int methodsCount = methods.length;
            for (int j=0; j<methodsCount; j++) {
              Method method = methods[j];
              if (method.getName().compareTo(methodName) == 0) {
                AccessDeniedMessage accessDeniedMessage = method.getAnnotation(AccessDeniedMessage.class);
                msg = new AccessDeniedResponse(accessDeniedMessage.value(), accessDeniedMessage.status());
                break;
              }
            }
          } catch (Exception e) {
          }
          msgMap.put(methodName, msg);
        }
        String error = errorsMap.get(msg.getStatus());
        if (error == null) {
          error = "Access denied.";
        }
        printError(request, response, msg.getStatus(), error, msg.getMessage());
        response.setStatus(msg.getStatus());
        break;
      }
    }
  }

  public static void printError(HttpServletRequest request, HttpServletResponse response, int status, String error, String msg)
    throws IOException {
    final String formatStr = "{\"timestamp\": \"%s\", \"status\": %d, \"error\": \"%s\", \"message\": \"%s\", \"path\": \"%s\"}";
    ZonedDateTime ts = ZonedDateTime.now(ZoneId.of("GMT+00:00"));
    String tsStr = ts.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'+00:00'"));
    String path = request.getServletPath();
    response.getWriter().format(formatStr, tsStr, status, error, msg, path);
  }
}