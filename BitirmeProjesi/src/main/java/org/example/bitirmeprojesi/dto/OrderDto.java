package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.StockState;

import java.io.Serializable;
import java.sql.Time;

/**
 * DTO for {@link Orders}
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class OrderDto implements Serializable {
    @JsonIgnore
    Long id;

    @JsonProperty("description")
    String description;

    @JsonProperty("name")
    String name;

    @JsonProperty("sale_date")
    Time saleDate;

    @JsonProperty("sum_price")
    Integer sumPrice;

    @JsonProperty("stock_state")
    StockState stockState;

    @JsonProperty("payment_state")
    PaymentState paymentState;
}