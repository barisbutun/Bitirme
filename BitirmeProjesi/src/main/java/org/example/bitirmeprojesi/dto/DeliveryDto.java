package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Delivery}
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class DeliveryDto implements Serializable {
    @JsonIgnore
    private UUID id;
    @JsonProperty("follow_number")
    private String followNumber;
    @JsonProperty("company_name")
    private String companyName;
    @JsonProperty("delivery_state")
    private boolean deliveryState;
    @JsonProperty("delivery_date")
    private LocalDateTime deliveryDate;
}