package com.example.demo.error;

public class UnauthenticatedException extends RuntimeException {
	public UnauthenticatedException(String message) {
		super(message);
	}
}

