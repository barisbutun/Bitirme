package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.Size;
import org.example.bitirmeprojesi.enums.StockState;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

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

    @JsonProperty("created_date")
    private LocalDateTime createdDate;


    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;


    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private double averageRating;

    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private int totalRating;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private int favouriteCount;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private int reviewCount;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private int saleCount;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private int sameCount;

    @JsonProperty("quantity")
    private Map<Size, @Positive(message = "Stock count must be positive") Integer> quantity;
}
