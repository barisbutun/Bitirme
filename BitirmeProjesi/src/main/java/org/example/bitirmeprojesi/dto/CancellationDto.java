package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.annotations.NaturalIdCache;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Cancellation}
 */
@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class CancellationDto implements Serializable {
    String id;
    @JsonProperty("description")
    String description;
    @JsonProperty("cancel_state")
    boolean cancelState;
}