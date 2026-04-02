package com.example.demo.history;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Interaction;
import com.example.demo.interaction.InteractionService;
import com.example.demo.security.SecurityUtils;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api")
@Validated
public class HistoryController {
	private final InteractionService interactionService;
	private final SecurityUtils securityUtils;

	public HistoryController(InteractionService interactionService, SecurityUtils securityUtils) {
		this.interactionService = interactionService;
		this.securityUtils = securityUtils;
	}

	@GetMapping("/history")
	public ResponseEntity<HistoryPageResponse> history(
			@RequestParam(defaultValue = "0") @Min(0) int page,
			@RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
		UUID userId = securityUtils.requireCurrentUserId();

		PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Interaction> interactions = interactionService.listHistory(userId, pageRequest);

		List<HistoryItem> items = interactions.getContent().stream()
				.map(this::toItem)
				.toList();

		return ResponseEntity.ok(new HistoryPageResponse(
				items,
				interactions.getNumber(),
				interactions.getSize(),
				interactions.getTotalElements(),
				interactions.getTotalPages()));
	}

	private HistoryItem toItem(Interaction interaction) {
		return new HistoryItem(
				interaction.getId(),
				interaction.getInput(),
				interaction.getOutput(),
				interaction.getCreatedAt());
	}

	public record HistoryItem(UUID id, String input, String output, Instant createdAt) {
	}

	public record HistoryPageResponse(List<HistoryItem> items, int page, int size, long totalElements,
			int totalPages) {
	}
}

