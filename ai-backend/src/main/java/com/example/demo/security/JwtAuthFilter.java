package com.example.demo.security;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
	private final JwtService jwtService;
	private final String cookieName;

	public JwtAuthFilter(JwtService jwtService, @Value("${app.jwt.cookie-name:AUTH_TOKEN}") String cookieName) {
		this.jwtService = jwtService;
		this.cookieName = cookieName;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		SecurityContextHolder.clearContext();
		String token = extractToken(request);
		if (token != null) {
			Optional<UUID> userIdOpt = jwtService.validateAndGetUserId(token);
			if (userIdOpt.isPresent()) {
				UUID userId = userIdOpt.get();
				var authentication = new UsernamePasswordAuthenticationToken(
						userId,
						null,
						List.of(new SimpleGrantedAuthority("ROLE_USER")));
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}

		filterChain.doFilter(request, response);
	}

	private String extractToken(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return null;
		}

		for (Cookie cookie : cookies) {
			if (cookieName.equals(cookie.getName())) {
				String value = cookie.getValue();
				return (value == null || value.isBlank()) ? null : value;
			}
		}
		return null;
	}
}

