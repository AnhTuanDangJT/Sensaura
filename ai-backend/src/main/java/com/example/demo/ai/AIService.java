package com.example.demo.ai;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AIService {
	// Mock response first. Later you can swap this implementation to call OpenAI (or another provider).
	public String generateResponse(String message) {
		return "Mock AI response to: " + message;
	}

	public Iterator<String> streamResponse(String message) {
		// Simple chunking by word. Real implementations should stream provider tokens.
		String full = generateResponse(message);
		List<String> chunks = Arrays.asList(full.split("\\s+"));
		return chunks.iterator();
	}
}

