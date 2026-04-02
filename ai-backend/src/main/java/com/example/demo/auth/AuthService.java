package com.example.demo.auth;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.auth.dto.LoginRequest;
import com.example.demo.auth.dto.RegisterRequest;
import com.example.demo.domain.User;
import com.example.demo.error.EmailAlreadyExistsException;
import com.example.demo.error.InvalidCredentialsException;
import com.example.demo.repo.UserRepository;
import com.example.demo.security.JwtService;

@Service
public class AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	public UUID register(RegisterRequest request) {
		String email = normalizeEmail(request.email());
		if (userRepository.existsByEmail(email)) {
			throw new EmailAlreadyExistsException("Email already registered");
		}

		String passwordHash = passwordEncoder.encode(request.password());
		User user = new User(email, passwordHash);
		return userRepository.save(user).getId();
	}

	public String login(LoginRequest request) {
		String email = normalizeEmail(request.email());

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new InvalidCredentialsException("Invalid email or password");
		}

		return jwtService.generateToken(user.getId());
	}

	private static String normalizeEmail(String email) {
		return email.trim().toLowerCase();
	}
}

