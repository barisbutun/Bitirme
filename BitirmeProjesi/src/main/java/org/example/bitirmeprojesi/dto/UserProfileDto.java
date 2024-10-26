package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.User}
 */

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor(force=true)
public class UserProfileDto implements Serializable {
    @JsonProperty("name")
    private    String name;
    @JsonProperty("email")
    private String email;
    @JsonProperty("phone")
    private String phone;
    @JsonProperty("address")
    private String address;
}