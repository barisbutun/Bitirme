package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.ShoppingCartItem}
 */
@Value
public class ShoppingCartItemDto implements Serializable {
      @JsonProperty(access = JsonProperty.Access.READ_ONLY)
      long id;
      @JsonProperty("product_id")
      ProductDto product;
      @JsonProperty("quantity")
      Integer quantity;
      @JsonProperty("user_id")
      UserDto user;
}