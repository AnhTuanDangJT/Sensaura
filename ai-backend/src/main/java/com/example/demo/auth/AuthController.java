package com.example.demo.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.dto.LoginRequest;
import com.example.demo.auth.dto.RegisterRequest;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
	private final AuthService authService;
	private final String cookieName;
	private final boolean cookieSecure;
	private final String cookieSameSite;
	private final long ttlSeconds;

	public AuthController(AuthService authService,
			@Value("${app.jwt.cookie-name:AUTH_TOKEN}") String cookieName,
			@Value("${app.jwt.cookie-secure:false}") boolean cookieSecure,
			@Value("${app.jwt.cookie-same-site:Lax}") String cookieSameSiteStr,
			@Value("${app.jwt.ttl-seconds:604800}") long ttlSeconds) {
		this.authService = authService;
		this.cookieName = cookieName;
		this.cookieSecure = cookieSecure;
		this.cookieSameSite = parseSameSite(cookieSameSiteStr);
		this.ttlSeconds = ttlSeconds;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
		var userId = authService.register(request);
		return ResponseEntity.status(201).body(new RegisterResponse(userId, request.email()));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(HttpServletResponse response, @Valid @RequestBody LoginRequest request) {
		String jwt = authService.login(request);
		addAuthCookie(response, jwt);
		return ResponseEntity.ok(new LoginResponse(request.email()));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
		clearAuthCookie(response);
		return ResponseEntity.ok().build();
	}

	private void addAuthCookie(HttpServletResponse response, String jwt) {
		String securePart = cookieSecure ? "; Secure" : "";
		String setCookie = "%s=%s; Path=/; Max-Age=%d; HttpOnly%s; SameSite=%s"
				.formatted(cookieName, jwt, ttlSeconds, securePart, cookieSameSite);
		response.addHeader(HttpHeaders.SET_COOKIE, setCookie);
	}

	private void clearAuthCookie(HttpServletResponse response) {
		String securePart = cookieSecure ? "; Secure" : "";
		String setCookie = "%s=; Path=/; Max-Age=0; HttpOnly%s; SameSite=%s"
				.formatted(cookieName, securePart, cookieSameSite);
		response.addHeader(HttpHeaders.SET_COOKIE, setCookie);
	}

	private static String parseSameSite(String value) {
		String normalized = value.trim().toLowerCase();
		return switch (normalized) {
			case "strict" -> "Strict";
			case "none" -> "None";
			case "lax" -> "Lax";
			default -> "Lax";
		};
	}

	public record RegisterResponse(java.util.UUID id, String email) {
	}

	public record LoginResponse(String email) {
	}
}

