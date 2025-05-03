package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderItemRefundDto {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("product_id")
    private long productId;

    @JsonProperty("refund_quantity")
    private Integer refundQuantity;

}
