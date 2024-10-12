package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.ShoppingCartItem}
 */
@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
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