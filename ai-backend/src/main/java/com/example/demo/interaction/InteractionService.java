package com.example.demo.interaction;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Interaction;
import com.example.demo.repo.InteractionRepository;

@Service
public class InteractionService {
	private final InteractionRepository interactionRepository;

	public InteractionService(InteractionRepository interactionRepository) {
		this.interactionRepository = interactionRepository;
	}

	public Interaction saveInteraction(UUID userId, String input, String output) {
		Interaction interaction = new Interaction(userId, input, output);
		return interactionRepository.save(interaction);
	}

	public Page<Interaction> listHistory(UUID userId, Pageable pageable) {
		return interactionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
	}
}

