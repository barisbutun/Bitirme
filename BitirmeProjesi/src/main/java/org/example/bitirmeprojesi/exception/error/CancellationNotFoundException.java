package org.example.bitirmeprojesi.exception.error;

public class CancellationNotFoundException extends RuntimeException{
    public CancellationNotFoundException(String message) {
        super(message);
    }
}
