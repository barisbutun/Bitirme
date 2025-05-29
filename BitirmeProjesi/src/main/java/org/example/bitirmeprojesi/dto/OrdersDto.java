package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.entity.Delivery;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.StockState;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO for {@link Orders}
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class OrdersDto implements Serializable {
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

    @JsonProperty("payment_state")
    private PaymentState paymentState;

    @JsonProperty("address")
    String address;

    @JsonProperty(value="user", access = JsonProperty.Access.READ_ONLY)
    private UserProfileDto user;

    @JsonProperty("is_same_address")
    boolean isSameAddress;

    @JsonProperty(value = "delivery",access = JsonProperty.Access.READ_ONLY)
    private DeliveryDto delivery;

    private List<OrderItemDto> orderItems;

}