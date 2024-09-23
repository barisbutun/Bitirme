package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.example.bitirmeprojesi.enums.Role;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class UserDto implements Serializable {

    @JsonIgnore
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("registered")
    private boolean registered;

    @JsonProperty("password")
    private String password;

    @JsonProperty("email")
    private String email;

    @JsonProperty("role")
    private Role role;
}