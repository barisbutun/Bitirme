package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.example.bitirmeprojesi.enums.RefundStatus;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Refund}
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RefundDto implements Serializable {


    @JsonProperty("id")
    private UUID id;

    @JsonProperty("description")
    private String description;

    @JsonProperty("order_id")
    @NotBlank(message = "Order id cannot be empty")
    private Long orderId;

    @NotBlank(message = "Refund reason cannot be empty")
    @JsonProperty("refund_reason")
    private String refundReason;

    @JsonProperty("status")
    private RefundStatus status;

    @JsonProperty("order_items")
    private List<OrderItemRefundDto> orderItems;



}