package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Category}
 */
@Value
public class CategoryDto implements Serializable {
    @JsonIgnore
    long id;
    @JsonProperty("name")
    String name;
}