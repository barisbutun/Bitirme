package org.example.bitirmeprojesi.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.Size;

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
    private Long id;
    @JsonProperty("product_id")
    private long productId;
    @JsonProperty("quantity")
    private Integer quantity;
    @JsonProperty("price")
    private double price;
    @JsonProperty("name")
    private String name;
    @JsonProperty("size")
    private Size size;

}