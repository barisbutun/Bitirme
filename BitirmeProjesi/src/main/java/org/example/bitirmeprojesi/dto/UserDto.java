package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.Role;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class UserDto implements Serializable {

    @JsonIgnore
    private UUID id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("registered")
    private boolean registered;

    @JsonProperty("password")
    private String password;

    @JsonProperty("email")
    @NotBlank(message = "Email alanı zorunludur")
    @Email(message = "Geçerli bir email adresi giriniz")
    private String email;

    @JsonProperty("role")
    private Role role;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("address")
    private String address;


}