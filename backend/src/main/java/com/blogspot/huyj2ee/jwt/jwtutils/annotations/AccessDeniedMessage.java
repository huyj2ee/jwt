package com.blogspot.huyj2ee.jwt.jwtutils.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.servlet.http.HttpServletResponse;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AccessDeniedMessage {
  String value() default "Forbidden";
  int status() default HttpServletResponse.SC_FORBIDDEN;
}