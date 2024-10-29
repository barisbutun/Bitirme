package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.OrderItem}
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class OrderItemDto implements Serializable {
    @JsonIgnore
    private Long id;
    @JsonProperty("product_id")
    private ProductDto productDto;
    @JsonProperty("order_id")
    private OrdersDto ordersDto;
    @JsonProperty("quantity")
    private Integer quantity;
    @JsonProperty("user_id")
    private UserDto user;
}