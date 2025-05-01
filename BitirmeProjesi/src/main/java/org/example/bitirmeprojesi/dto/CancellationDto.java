package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Cancellation}
 */

@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class CancellationDto implements Serializable {
    private Long id;

    @JsonProperty("description")
    private String description;

    @JsonProperty("order_id")
    private Long orderId;


    @JsonProperty("order_items")
    private List<OrderItemCancellationDto>orderItems;


}