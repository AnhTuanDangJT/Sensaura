package com.example.demo.ai;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiStreamingConfig {

	@Bean(name = "aiSseExecutor")
	public Executor aiSseExecutor() {
		return Executors.newFixedThreadPool(8, r -> {
			Thread t = new Thread(r, "ai-sse");
			t.setDaemon(true);
			return t;
		});
	}
}
