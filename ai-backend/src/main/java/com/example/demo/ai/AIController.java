package com.example.demo.ai;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.demo.interaction.InteractionService;
import com.example.demo.security.SecurityUtils;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api")
public class AIController {
	private static final Logger log = LoggerFactory.getLogger(AIController.class);

	public static final int MAX_MESSAGE_CHARS = 8192;
	public static final int MAX_AI_OUTPUT_CHARS = 8192;

	private final AIService aiService;
	private final InteractionService interactionService;
	private final SecurityUtils securityUtils;
	private final Executor aiSseExecutor;
	private final long sseEmitterTimeoutMs;

	public AIController(AIService aiService,
			InteractionService interactionService,
			SecurityUtils securityUtils,
			@Qualifier("aiSseExecutor") Executor aiSseExecutor,
			@Value("${app.sse.emitter-timeout-ms:120000}") long sseEmitterTimeoutMs) {
		this.aiService = aiService;
		this.interactionService = interactionService;
		this.securityUtils = securityUtils;
		this.aiSseExecutor = aiSseExecutor;
		this.sseEmitterTimeoutMs = sseEmitterTimeoutMs;
	}

	@PostMapping("/ai")
	public ResponseEntity<AiResponse> ai(@Valid @RequestBody AiRequest request) {
		UUID userId = securityUtils.requireCurrentUserId();
		String output = truncate(aiService.generateResponse(request.message()), MAX_AI_OUTPUT_CHARS);
		interactionService.saveInteraction(userId, request.message(), output);
		return ResponseEntity.ok(new AiResponse(output));
	}

	@PostMapping(value = "/ai/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter aiStream(@Valid @RequestBody AiRequest request) {
		UUID userId = securityUtils.requireCurrentUserId();
		String input = request.message();

		SseEmitter emitter = new SseEmitter(sseEmitterTimeoutMs);

		CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
			StringBuilder outputBuilder = new StringBuilder();
			boolean firstChunk = true;
			boolean truncated = false;

			try {
				var iterator = aiService.streamResponse(input);
				while (iterator.hasNext()) {
					String chunk = iterator.next();
					int extra = firstChunk ? chunk.length() : 1 + chunk.length();
					if (outputBuilder.length() + extra > MAX_AI_OUTPUT_CHARS) {
						truncated = true;
						break;
					}
					if (!firstChunk) {
						outputBuilder.append(' ');
					}
					outputBuilder.append(chunk);
					firstChunk = false;
					emitter.send(SseEmitter.event().name("chunk").data(chunk));
				}

				String output = outputBuilder.toString();
				if (truncated) {
					try {
						emitter.send(SseEmitter.event().name("error").data("Response size limit exceeded"));
					} catch (Exception sendEx) {
						log.debug("Could not send truncation SSE event", sendEx);
					}
				}
				interactionService.saveInteraction(userId, input, output);
				emitter.send(SseEmitter.event().name("done").data(output));
				emitter.complete();
			} catch (Exception e) {
				log.warn("SSE stream failed for user {}", userId, e);
				try {
					emitter.send(SseEmitter.event().name("error").data("Stream failed"));
				} catch (Exception sendEx) {
					log.debug("Could not send error SSE event", sendEx);
				}
				emitter.complete();
			}
		}, aiSseExecutor);

		emitter.onCompletion(() -> future.cancel(true));
		emitter.onTimeout(() -> future.cancel(true));
		emitter.onError(e -> future.cancel(true));

		return emitter;
	}

	private static String truncate(String s, int maxLen) {
		if (s == null || s.length() <= maxLen) {
			return s;
		}
		return s.substring(0, maxLen);
	}

	public record AiRequest(@NotBlank @Size(max = MAX_MESSAGE_CHARS) String message) {
	}

	public record AiResponse(String response) {
	}
}
