package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Cancellation}
 */
public class CancellationDto {


    private Long id;

    @JsonProperty("description")
    private String description;


    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("order_items")
    private List<OrderItemCancellationDto> orderItems;


}


