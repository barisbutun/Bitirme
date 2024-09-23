package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

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

    @JsonProperty("category")
    String category;

    @JsonProperty("price")
    double price;

    @JsonProperty("stock_state")
    boolean stockState;
}
