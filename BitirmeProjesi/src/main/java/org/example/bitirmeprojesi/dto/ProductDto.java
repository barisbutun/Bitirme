package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.StockState;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Product}
 */

@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class ProductDto implements Serializable {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    Long id;

    @JsonProperty("description")
    String description;

    @JsonProperty("name")
    String name;

    @JsonProperty("price")
    double price;

    @JsonProperty("stock_state")
    StockState stockState;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private double averageRating;

    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("quantity")
    @NotNull(message = "Quantity cannot be null")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
}
