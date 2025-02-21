package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.Favourite}
 */

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor(force = true)
public class FavouriteDto implements Serializable {
    @JsonIgnore
    private long id;
    @JsonProperty("product_id")
    private long productId;
    @JsonProperty("category_id")
    private long categoryId;

    @JsonProperty("price")
    double price;

    @JsonProperty("name")
    String name;

}