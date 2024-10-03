package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.StockState;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Orders}
 */
@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Getter
@Setter
public class OrderGetOrderItemsDto implements Serializable {
    @JsonIgnore
    Long id;

    @JsonProperty("description")
    String description;

    @JsonProperty("name")
    String name;

    @JsonProperty("sale_date")
    LocalDateTime saleDate;

    @JsonProperty("order_id")
    OrdersDto ordersDto;

    @JsonProperty("sum_price")
    double sumPrice;

    @JsonProperty("stock_state")
    StockState stockState;

    @JsonProperty("payment_state")
    PaymentState paymentState;

    @JsonProperty("order_items")
    List<OrderItemDto> orderItems;
}