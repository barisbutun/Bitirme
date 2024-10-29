package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.ShoppingCartItem}
 */

@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class ShoppingCartItemDto implements Serializable {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;
    @JsonProperty("product_id")
    private ProductDto product;
    @JsonProperty("quantity")
    private Integer quantity;
    @JsonProperty("user_id")
    private UserDto user;
}