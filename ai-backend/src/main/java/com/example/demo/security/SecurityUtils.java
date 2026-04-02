package com.example.demo.security;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.demo.error.UnauthenticatedException;

@Component
public class SecurityUtils {
	public UUID requireCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
			throw new UnauthenticatedException("Authentication required");
		}

		Object principal = authentication.getPrincipal();
		if (principal instanceof UUID userId) {
			return userId;
		}

		if (principal instanceof String principalString) {
			try {
				return UUID.fromString(principalString);
			} catch (IllegalArgumentException ex) {
				throw new UnauthenticatedException("Authentication required");
			}
		}

		throw new UnauthenticatedException("Authentication required");
	}
}

