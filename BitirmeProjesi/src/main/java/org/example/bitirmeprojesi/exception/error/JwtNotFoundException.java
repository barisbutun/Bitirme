package org.example.bitirmeprojesi.exception.error;

public class JwtNotFoundException extends RuntimeException {

    public JwtNotFoundException(String message) {
        super(message);
    }
}
