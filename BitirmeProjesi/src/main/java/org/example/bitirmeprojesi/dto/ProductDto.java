package org.example.bitirmeprojesi.dto;

import lombok.AllArgsConstructor;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Product}
 */
@Value
@AllArgsConstructor
public class ProductDto implements Serializable {
    Long id;
    String description;
    String name;
    String category;
    double price;
    boolean stockState;
}