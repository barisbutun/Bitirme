package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.bitirmeprojesi.enums.Role;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class UserElasticDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @JsonProperty("name")
    private String name;


    @JsonProperty("password")
    private String password;

    @JsonProperty("email")
    private String email;


    @JsonProperty("balance")
    private double balance;


    @JsonProperty("phone")
    private String phone;

    @JsonProperty("address")
    private String address;

    @JsonProperty(access=JsonProperty.Access.READ_ONLY)
    private Role role;

}
