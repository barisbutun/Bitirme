package org.example.bitirmeprojesi.dto;

import lombok.Getter;
import lombok.Setter;
import org.example.bitirmeprojesi.entity.User;

import java.util.Optional;


@Getter
@Setter
public class LoginResponseDto {

    private User user;
    private String token;


    public LoginResponseDto(Optional<User> byUsername, String token) {
        this.user = byUsername.orElse(null);
        this.token = token;
    }

    public LoginResponseDto(User user, String token) {
        this.user = user;
        this.token = token;
    }
}
