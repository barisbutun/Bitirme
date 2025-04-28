package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
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
public class CancellationDto implements Serializable {
    private Long id;

    @JsonProperty("description")
    private String description;

    @NotBlank(message = "Quantity cannot be empty")
    @JsonProperty("quantity")
    private int quantity;

    @JsonProperty("order_item_id")
    private Long orderItemId;


}