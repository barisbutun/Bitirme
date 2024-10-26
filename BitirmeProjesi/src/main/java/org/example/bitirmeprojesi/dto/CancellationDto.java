package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Cancellation}
 */

@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class CancellationDto implements Serializable {
    private String id;
    @JsonProperty("description")
    private String description;
    @JsonProperty("cancel_state")
    private boolean cancelState;
}