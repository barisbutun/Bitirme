package org.example.bitirmeprojesi.dto;

import lombok.Getter;
import lombok.Setter;
import org.example.bitirmeprojesi.entity.User;

import java.util.Optional;


@Getter
@Setter
public class LoginResponseDto {

    private String token;


    public LoginResponseDto( String token) {
        this.token = token;
    }
}
