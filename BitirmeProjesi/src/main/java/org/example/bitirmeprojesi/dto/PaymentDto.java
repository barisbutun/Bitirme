package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.example.bitirmeprojesi.enums.PaymentState;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Payment}
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaymentDto implements Serializable {

    private UUID id;

    @JsonProperty("payment_state")
    private PaymentState paymentState;

    @JsonProperty("order_id")
    private Long orderId;
}