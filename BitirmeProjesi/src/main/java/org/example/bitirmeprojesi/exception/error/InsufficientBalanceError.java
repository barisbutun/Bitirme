package org.example.bitirmeprojesi.exception.error;

public class InsufficientBalanceError extends RuntimeException {
    public InsufficientBalanceError(String message) {
        super(message);
    }
}
