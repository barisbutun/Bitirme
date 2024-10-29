package org.example.bitirmeprojesi.exception.error;

public class CategoryNotFoundException extends RuntimeException {


    private long id;
    public CategoryNotFoundException(String message, long id) {
        super(message);
        this.id = id;
    }
}
