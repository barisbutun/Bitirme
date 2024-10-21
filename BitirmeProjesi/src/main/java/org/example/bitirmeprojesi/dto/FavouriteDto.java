package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Favourite}
 */
@Value
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor(force = true)
public class FavouriteDto implements Serializable {
    @JsonIgnore
    long id;
    @JsonProperty("user")
    UserDto user;
    @JsonProperty("product")
    ProductDto product;
    @JsonProperty("category")
    CategoryDto category;
}