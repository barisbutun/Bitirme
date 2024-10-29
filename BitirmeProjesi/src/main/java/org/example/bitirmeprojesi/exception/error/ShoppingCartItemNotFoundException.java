package org.example.bitirmeprojesi.exception.error;

public class ShoppingCartItemNotFoundException extends RuntimeException {

    public ShoppingCartItemNotFoundException(String message) {
        super(message);
    }
}
