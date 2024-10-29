package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.StockState;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Orders}
 */

@NoArgsConstructor(force = true)
@AllArgsConstructor
@Getter
@Setter
public class OrderGetOrderItemsDto implements Serializable {
    @JsonProperty("order_items")
    List<OrderItemDto> orderItems;
    @JsonIgnore
    private Long id;
    @JsonProperty("description")
    private String description;
    @JsonProperty("name")
    private String name;
    @JsonProperty("sale_date")
    private LocalDateTime saleDate;
    @JsonProperty("order_id")
    private OrdersDto ordersDto;
    @JsonProperty("sum_price")
    private double sumPrice;
    @JsonProperty("stock_state")
    private StockState stockState;
    @JsonProperty("payment_state")
    private PaymentState paymentState;
}