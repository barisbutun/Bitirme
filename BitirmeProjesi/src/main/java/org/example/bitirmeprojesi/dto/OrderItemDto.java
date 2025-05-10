package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.Size;

import java.io.Serializable;
import java.util.UUID;

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
    private long productId;
    @JsonProperty("order_id")
    private long orderId;
    @JsonProperty("quantity")
    private Integer quantity;
    @JsonProperty("total_price")
    private Double price;
    @JsonProperty("size")
    private Size size;
    @JsonIgnore
    private UUID userId;
}