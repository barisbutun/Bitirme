package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.User}
 */
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class UserPatchDto implements Serializable {
    @JsonProperty("name")
    String name;
    @JsonProperty("password")
    String password;
    @JsonProperty("email")
    String email;
    @JsonProperty("phone")
    String phone;
}