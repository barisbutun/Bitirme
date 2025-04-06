package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Review}
 */
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class ReviewDto implements Serializable {
    @Min(1)
    @Max(5)
    @JsonProperty("rating")
    private int rating;

    @NotNull
    @JsonProperty("product_id")
    private Long productId;

}