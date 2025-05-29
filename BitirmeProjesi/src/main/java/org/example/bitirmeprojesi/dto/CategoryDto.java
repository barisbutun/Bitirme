package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Category}
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class CategoryDto implements Serializable {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @JsonProperty("name")
    private String name;
}