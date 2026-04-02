package com.example.demo.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class JwtService {
	private final ObjectMapper objectMapper;
	private final String jwtSecret;
	private final long tokenTtlSeconds;

	private static final int MIN_SECRET_LENGTH_BYTES = 32;

	public JwtService(ObjectMapper objectMapper,
			@Value("${app.jwt.secret}") String jwtSecret,
			@Value("${app.jwt.ttl-seconds:604800}") long tokenTtlSeconds) {
		this.objectMapper = objectMapper;
		if (jwtSecret == null || jwtSecret.isBlank()) {
			throw new IllegalStateException(
					"JWT_SECRET is not set. Quick local run: use profile \"local\" (see run-local.ps1) "
							+ "or set JWT_SECRET to at least 32 UTF-8 characters. "
							+ "Production: set JWT_SECRET and DB_* variables.");
		}
		if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < MIN_SECRET_LENGTH_BYTES) {
			throw new IllegalStateException(
					"JWT_SECRET must be at least %d UTF-8 bytes (got %d).".formatted(
							MIN_SECRET_LENGTH_BYTES, jwtSecret.getBytes(StandardCharsets.UTF_8).length));
		}
		if (tokenTtlSeconds <= 0) {
			throw new IllegalStateException("app.jwt.ttl-seconds must be positive");
		}
		this.jwtSecret = jwtSecret;
		this.tokenTtlSeconds = tokenTtlSeconds;
	}

	public String generateToken(UUID userId) {
		try {
			String headerJson = objectMapper.writeValueAsString(Map.of("alg", "HS256", "typ", "JWT"));

			Instant now = Instant.now();
			Instant exp = now.plusSeconds(tokenTtlSeconds);

			Map<String, Object> claims = new HashMap<>();
			claims.put("sub", userId.toString());
			claims.put("iat", now.getEpochSecond());
			claims.put("exp", exp.getEpochSecond());

			String claimsJson = objectMapper.writeValueAsString(claims);

			String unsignedToken = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8)) + "."
					+ base64UrlEncode(claimsJson.getBytes(StandardCharsets.UTF_8));
			String signature = sign(unsignedToken);

			return unsignedToken + "." + signature;
		} catch (JsonProcessingException e) {
			// Should never happen; ObjectMapper is deterministic for our simple maps.
			throw new IllegalStateException("Failed to serialize JWT claims", e);
		}
	}

	public Optional<UUID> validateAndGetUserId(String token) {
		try {
			String[] parts = token.split("\\.");
			if (parts.length != 3) {
				return Optional.empty();
			}

			String unsignedToken = parts[0] + "." + parts[1];
			String signature = parts[2];
			String expectedSignature = sign(unsignedToken);
			if (!java.security.MessageDigest.isEqual(signature.getBytes(StandardCharsets.UTF_8),
					expectedSignature.getBytes(StandardCharsets.UTF_8))) {
				return Optional.empty();
			}

			String claimsJson = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);
			@SuppressWarnings("unchecked")
			Map<String, Object> claims = objectMapper.readValue(claimsJson, Map.class);

			Object expValue = claims.get("exp");
			if (!(expValue instanceof Number expNumber)) {
				return Optional.empty();
			}
			long expSeconds = expNumber.longValue();

			// exp is inclusive: token is invalid at and after exp (RFC 7519).
			if (Instant.now().getEpochSecond() >= expSeconds) {
				return Optional.empty();
			}

			Object subValue = claims.get("sub");
			if (!(subValue instanceof String subValueStr)) {
				return Optional.empty();
			}

			return Optional.of(UUID.fromString(subValueStr));
		} catch (Exception e) {
			return Optional.empty();
		}
	}

	private String sign(String unsignedToken) {
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			SecretKeySpec keySpec = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
			mac.init(keySpec);
			byte[] signatureBytes = mac.doFinal(unsignedToken.getBytes(StandardCharsets.UTF_8));
			return base64UrlEncode(signatureBytes);
		} catch (Exception e) {
			throw new IllegalStateException("Failed to sign JWT", e);
		}
	}

	private static String base64UrlEncode(byte[] bytes) {
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}

	private static byte[] base64UrlDecode(String value) {
		return Base64.getUrlDecoder().decode(value);
	}
}

