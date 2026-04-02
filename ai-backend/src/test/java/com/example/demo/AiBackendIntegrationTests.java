package com.example.demo;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.hamcrest.MatcherAssert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.example.demo.ai.AIController;
import com.example.demo.domain.Interaction;
import com.example.demo.domain.User;
import com.example.demo.repo.InteractionRepository;
import com.example.demo.repo.UserRepository;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AiBackendIntegrationTests {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private InteractionRepository interactionRepository;

	private static String jsonMessage(String message) {
		return "{\"message\":\"%s\"}".formatted(message);
	}

	private static String jsonLogin(String email, String password) {
		return "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password);
	}

	private String loginAndGetAuthCookie(String email, String password) throws Exception {
		mockMvc.perform(post("/auth/register").with(csrf()).contentType(APPLICATION_JSON).content(jsonLogin(email, password)))
				.andExpect(status().isCreated());

		MvcResult loginResult = mockMvc.perform(post("/auth/login").with(csrf()).contentType(APPLICATION_JSON).content(jsonLogin(email, password)))
				.andExpect(status().isOk())
				.andReturn();

		Cookie cookie = loginResult.getResponse().getCookie("AUTH_TOKEN");
		if (cookie == null) {
			throw new AssertionError("AUTH_TOKEN cookie missing");
		}
		return cookie.getValue();
	}

	private static Cookie authCookie(String token) {
		return new Cookie("AUTH_TOKEN", token);
	}

	@Test
	void authCsrf_returnsTokenAndHeaderName() throws Exception {
		mockMvc.perform(get("/auth/csrf"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").exists())
				.andExpect(jsonPath("$.headerName").exists())
				.andExpect(jsonPath("$.parameterName").exists());
	}

	@Test
	void registerLogin_setsHttpOnlyAuthCookie() throws Exception {
		String email = "user-%s@example.com".formatted(UUID.randomUUID());
		String password = "very-strong-password";

		mockMvc.perform(post("/auth/register").with(csrf()).contentType(APPLICATION_JSON).content(jsonLogin(email, password)))
				.andExpect(status().isCreated());

		MvcResult loginResult = mockMvc.perform(post("/auth/login").with(csrf()).contentType(APPLICATION_JSON).content(jsonLogin(email, password)))
				.andExpect(status().isOk())
				.andReturn();

		Cookie cookie = loginResult.getResponse().getCookie("AUTH_TOKEN");
		org.junit.jupiter.api.Assertions.assertNotNull(cookie);
		String setCookieHeader = loginResult.getResponse().getHeader("Set-Cookie");
		org.junit.jupiter.api.Assertions.assertNotNull(setCookieHeader);
		org.junit.jupiter.api.Assertions.assertTrue(setCookieHeader.toLowerCase().contains("httponly"));
	}

	@Test
	void apiAi_withoutAuth_returns401() throws Exception {
		mockMvc.perform(post("/api/ai").with(csrf()).contentType(APPLICATION_JSON).content(jsonMessage("hi")))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void apiAi_invalidJwt_returns401() throws Exception {
		mockMvc.perform(post("/api/ai")
						.with(csrf())
						.cookie(new Cookie("AUTH_TOKEN", "not.a.valid.jwt.token"))
						.contentType(APPLICATION_JSON)
						.content(jsonMessage("hi")))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void apiAi_messageTooLong_returns400() throws Exception {
		String email = "longmsg-%s@example.com".formatted(UUID.randomUUID());
		String token = loginAndGetAuthCookie(email, "very-strong-password");
		String tooLong = "x".repeat(AIController.MAX_MESSAGE_CHARS + 1);
		mockMvc.perform(post("/api/ai")
						.with(csrf())
						.cookie(authCookie(token))
						.contentType(APPLICATION_JSON)
						.content(jsonMessage(tooLong)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void adminPath_withUserRole_returns403() throws Exception {
		String email = "admin-%s@example.com".formatted(UUID.randomUUID());
		String token = loginAndGetAuthCookie(email, "very-strong-password");
		mockMvc.perform(get("/admin/anything").cookie(authCookie(token)))
				.andExpect(status().isForbidden());
	}

	@Test
	void aiPersistsInteraction_andHistoryIsScopedToUser() throws Exception {
		String emailA = "a-%s@example.com".formatted(UUID.randomUUID());
		String emailB = "b-%s@example.com".formatted(UUID.randomUUID());
		String password = "very-strong-password";

		String tokenA = loginAndGetAuthCookie(emailA, password);
		String tokenB = loginAndGetAuthCookie(emailB, password);

		mockMvc.perform(post("/api/ai").with(csrf()).cookie(authCookie(tokenA)).contentType(APPLICATION_JSON).content(jsonMessage("hello")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.response").value(containsString("Mock AI response")));

		mockMvc.perform(post("/api/ai").with(csrf()).cookie(authCookie(tokenB)).contentType(APPLICATION_JSON).content(jsonMessage("world")))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/history").cookie(authCookie(tokenA)).param("page", "0").param("size", "10"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.items", hasSize(1)))
				.andExpect(jsonPath("$.items[0].input").value("hello"));

		User userA = userRepository.findByEmail(emailA).orElseThrow();
		User userB = userRepository.findByEmail(emailB).orElseThrow();

		Interaction interactionA = interactionRepository.findByUserIdOrderByCreatedAtDesc(userA.getId(), org.springframework.data.domain.PageRequest.of(0, 10)).getContent().get(0);
		org.junit.jupiter.api.Assertions.assertEquals("hello", interactionA.getInput());

		org.junit.jupiter.api.Assertions.assertEquals(2L, interactionRepository.count());
	}

	@Test
	void aiStream_emitsSseEventsAndCompletes() throws Exception {
		String email = "stream-%s@example.com".formatted(UUID.randomUUID());
		String password = "very-strong-password";
		String token = loginAndGetAuthCookie(email, password);

		MvcResult mvcResult = mockMvc.perform(post("/api/ai/stream")
						.with(csrf())
						.cookie(authCookie(token))
						.contentType(APPLICATION_JSON)
						.content(jsonMessage("stream-test")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM_VALUE))
				.andReturn();

		String body = mvcResult.getResponse().getContentAsString();
		MatcherAssert.assertThat(body, containsString("event:chunk"));
		MatcherAssert.assertThat(body, containsString("event:done"));

		User user = userRepository.findByEmail(email).orElseThrow();
		org.junit.jupiter.api.Assertions.assertEquals(1L, interactionRepository.findByUserIdOrderByCreatedAtDesc(
				user.getId(),
				org.springframework.data.domain.PageRequest.of(0, 10)).getTotalElements());
	}
}
