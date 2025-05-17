package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CommentDto implements Serializable {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private String content;

    @JsonProperty("product_id")
    private Long productId;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty(value = "is_purchased", access = JsonProperty.Access.READ_ONLY)
    private boolean isPurchased;

    @JsonProperty(value = "created_at", access = JsonProperty.Access.READ_ONLY)
    private String createdAt;

    private ReviewDto review;
}
