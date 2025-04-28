package org.example.bitirmeprojesi.exception.error;

public class DeliveredOrderShouldBeRefundedException extends RuntimeException {
    public DeliveredOrderShouldBeRefundedException(String message) {
        super(message);
    }
}
