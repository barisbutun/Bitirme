package org.example.bitirmeprojesi.exception.error;

public class OrderItemNotFoundException extends RuntimeException {

    public OrderItemNotFoundException(String message) {
        super(message);
    }
}
