package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.json.Json;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.DeliveryStatus;

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
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    @JsonProperty("company_name")
    private String companyName;
    @JsonProperty("delivery_state")
    private DeliveryStatus deliveryState;
    @JsonProperty("delivery_date")
    private LocalDateTime deliveryDate;
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
}