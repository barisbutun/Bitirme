package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.StockState;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for {@link Orders}
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class OrdersDto implements Serializable {
    @JsonIgnore
    Long id;

    @JsonProperty("description")
    String description;

    @JsonProperty("name")
    String name;

    @JsonProperty("sale_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime saleDate;

    @JsonProperty("sum_price")
    double sumPrice;

    @JsonProperty("stock_state")
    StockState stockState;

    @JsonIgnore
    private UUID userId;

    @JsonProperty("payment_state")
    PaymentState paymentState;
}