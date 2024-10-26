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
public class LoginRequestDto implements Serializable {
    @JsonProperty("email")
    private  String email;
    @JsonProperty("password")
    private String password;

}