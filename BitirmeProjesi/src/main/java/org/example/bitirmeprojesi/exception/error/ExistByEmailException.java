package org.example.bitirmeprojesi.exception.error;

public class ExistByEmailException extends RuntimeException {

    public ExistByEmailException(String message) {
        super(message);
    }
}
