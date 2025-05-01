package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;


    /**
     * DTO for {@link org.example.bitirmeprojesi.entity.Cancellation}
     */

    @AllArgsConstructor
    @NoArgsConstructor(force = true)
    @Getter
    @Setter
    public class OrderItemCancellationDto implements Serializable {
        @JsonProperty("id")
        private Long id;

        @JsonProperty("product_id")
        private long productId;

        @JsonProperty("cancel_quantity")
        private Integer cancelQuantity;

    }

