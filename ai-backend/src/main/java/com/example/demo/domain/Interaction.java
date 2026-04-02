package com.example.demo.domain;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(
		name = "interactions",
		indexes = {
				@Index(name = "idx_interactions_user_id", columnList = "user_id"),
				@Index(name = "idx_interactions_user_created", columnList = "user_id, created_at")
		}
)
public class Interaction {
	@Id
	@GeneratedValue
	@UuidGenerator
	private UUID id;

	@Column(name = "user_id", nullable = false)
	private UUID userId;

	@Lob
	@Column(nullable = false, columnDefinition = "TEXT")
	private String input;

	@Lob
	@Column(nullable = false, columnDefinition = "TEXT")
	private String output;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	protected Interaction() {
		// for JPA
	}

	public Interaction(UUID userId, String input, String output) {
		this.userId = userId;
		this.input = input;
		this.output = output;
	}

	public UUID getId() {
		return id;
	}

	public UUID getUserId() {
		return userId;
	}

	public String getInput() {
		return input;
	}

	public String getOutput() {
		return output;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
