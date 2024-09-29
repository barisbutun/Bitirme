package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    ProductDto productDto;
    OrdersDto ordersDto;
    Integer quantity;
    UserDto user;
}