package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.OrderItem}
 */
@Value
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class OrderItemDto implements Serializable {
    @JsonIgnore
    Long id;
    @JsonProperty("product_id")
    ProductDto productDto;
    @JsonProperty("order_id")
    OrdersDto ordersDto;
    @JsonProperty("quantity")
    Integer quantity;
    @JsonProperty("user_id")
    UserDto user;
}