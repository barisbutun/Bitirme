package org.example.bitirmeprojesi.exception.error;

public class PaymentNotCompletedException extends RuntimeException {

    public PaymentNotCompletedException(String message) {
        super(message);
    }
}
