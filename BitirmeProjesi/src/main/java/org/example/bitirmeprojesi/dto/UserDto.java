package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Value;
import org.example.bitirmeprojesi.enums.Role;

import java.io.Serializable;

@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class UserDto implements Serializable {

    @JsonIgnore
    private Long id;

    private String name;

    private boolean registered;

    private String password;

    private String email;

    private Role role;
}