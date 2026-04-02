package com.example.demo.error;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
			HttpServletRequest request) {
		List<String> details = ex.getBindingResult().getFieldErrors().stream()
				.map(fe -> "%s: %s".formatted(fe.getField(), fe.getDefaultMessage()))
				.collect(Collectors.toList());

		return build(HttpStatus.BAD_REQUEST, "Validation failed", "Validation failed", details, request.getRequestURI());
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
		List<String> details = ex.getConstraintViolations().stream()
				.map(cv -> "%s: %s".formatted(cv.getPropertyPath(), cv.getMessage()))
				.collect(Collectors.toList());
		return build(HttpStatus.BAD_REQUEST, "Validation failed", "Validation failed", details, request.getRequestURI());
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
		return build(HttpStatus.BAD_REQUEST, "Invalid request parameter", "Bad request", null, request.getRequestURI());
	}

	@ExceptionHandler({ UnauthenticatedException.class, InvalidCredentialsException.class })
	public ResponseEntity<ErrorResponse> handleAuth(RuntimeException ex, HttpServletRequest request) {
		return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), "Unauthorized", null, request.getRequestURI());
	}

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<ErrorResponse> handleConflict(EmailAlreadyExistsException ex, HttpServletRequest request) {
		return build(HttpStatus.CONFLICT, ex.getMessage(), "Conflict", null, request.getRequestURI());
	}

	@ExceptionHandler({ NoHandlerFoundException.class, EntityNotFoundException.class })
	public ResponseEntity<ErrorResponse> handleNotFound(Exception ex, HttpServletRequest request) {
		return build(HttpStatus.NOT_FOUND, "Resource not found", "Not found", null, request.getRequestURI());
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
		log.warn("Data integrity violation at {}", request.getRequestURI(), ex);
		return build(HttpStatus.CONFLICT, "Request could not be completed due to a data conflict", "Conflict", null,
				request.getRequestURI());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
		log.error("Unhandled error at {}", request.getRequestURI(), ex);
		return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", "Internal Server Error", null, request.getRequestURI());
	}

	private static ResponseEntity<ErrorResponse> build(HttpStatus status, String message, String error, List<String> details, String path) {
		ErrorResponse body = new ErrorResponse(
				Instant.now(),
				status.value(),
				error,
				message,
				path,
				details);
		return ResponseEntity.status(status).body(body);
	}

	public record ErrorResponse(Instant timestamp, int status, String error, String message, String path, List<String> details) {
	}
}
