package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Size;
import lombok.*;



import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.User}
 */
@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class RegisterDto implements Serializable {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    UUID id;
    @JsonProperty("name")
    String name;
    @JsonProperty("user_name")
    String userName;
    @JsonProperty("password")
    @Size(min = 4,max = 50, message = "Password must be at least 8 characters long")
    String password;
    @JsonProperty("email")
    String email;
    @JsonProperty("phone")
    String phone;
    @JsonProperty("address")
    String address;
}