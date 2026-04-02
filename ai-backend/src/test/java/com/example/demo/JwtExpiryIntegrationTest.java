package com.example.demo;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.http.Cookie;

@SpringBootTest(properties = "app.jwt.ttl-seconds=1")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class JwtExpiryIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	private static String jsonLogin(String email, String password) {
		return "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password);
	}

	private static String jsonMessage(String message) {
		return "{\"message\":\"%s\"}".formatted(message);
	}

	@Test
	void expiredJwt_returns401() throws Exception {
		String email = "exp-%s@example.com".formatted(UUID.randomUUID());
		String password = "very-strong-password";

		mockMvc.perform(post("/auth/register").with(csrf()).contentType(APPLICATION_JSON).content(jsonLogin(email, password)))
				.andExpect(status().isCreated());

		var loginResult = mockMvc.perform(post("/auth/login").with(csrf()).contentType(APPLICATION_JSON).content(jsonLogin(email, password)))
				.andExpect(status().isOk())
				.andReturn();

		Cookie auth = loginResult.getResponse().getCookie("AUTH_TOKEN");
		org.junit.jupiter.api.Assertions.assertNotNull(auth);

		Thread.sleep(1100L);

		mockMvc.perform(post("/api/ai")
						.with(csrf())
						.cookie(auth)
						.contentType(APPLICATION_JSON)
						.content(jsonMessage("after-expiry")))
				.andExpect(status().isUnauthorized());
	}
}
