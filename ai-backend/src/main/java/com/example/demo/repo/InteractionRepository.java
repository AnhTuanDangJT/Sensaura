package com.example.demo.repo;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.domain.Interaction;

public interface InteractionRepository extends JpaRepository<Interaction, UUID> {
	Page<Interaction> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}

