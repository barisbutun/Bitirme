package org.example.bitirmeprojesi.exception.error;

public class CommentLimitExceededException extends RuntimeException {
    public CommentLimitExceededException(String message) {
        super(message);
    }

}
