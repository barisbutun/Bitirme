package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Refund}
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RefundDto implements Serializable {

    @NotBlank(message = "Order id cannot be empty")
    @JsonProperty("order_id")
    private long order_id;


    @NotBlank(message = "Refund reason cannot be empty")
    @JsonProperty("refund_reason")
    String refundReason;
}