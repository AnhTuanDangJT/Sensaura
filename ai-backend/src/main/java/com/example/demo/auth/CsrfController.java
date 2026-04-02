package com.example.demo.auth;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/auth")
public class CsrfController {

	@GetMapping("/csrf")
	public ResponseEntity<Map<String, String>> csrf(HttpServletRequest request) {
		CsrfToken token = (CsrfToken) request.getAttribute("_csrf");
		if (token == null) {
			return ResponseEntity.internalServerError()
					.body(Map.of("error", "CSRF token not initialized"));
		}
		return ResponseEntity.ok(Map.of(
				"token", token.getToken(),
				"headerName", token.getHeaderName(),
				"parameterName", token.getParameterName()));
	}
}
