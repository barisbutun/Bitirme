package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Category}
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class CategoryDto implements Serializable {
    @JsonIgnore
    private    long id;
    @JsonProperty("name")
    private String name;
}