package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Delivery}
 */
@Value
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class DeliveryDto implements Serializable {
    @JsonIgnore
    UUID id;
    @JsonProperty("follow_number")
    String followNumber;
    @JsonProperty("company_name")
    String companyName;
    @JsonProperty("delivery_state")
    boolean deliveryState;
    @JsonProperty("delivery_date")
    LocalDateTime deliveryDate;
}