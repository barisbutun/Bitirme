package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.LoginRequestDto;
import org.example.bitirmeprojesi.dto.LoginResponseDto;
import org.example.bitirmeprojesi.dto.RegisterDto;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/v1/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterDto registerDto) {
        UserDto userDto = authenticationService.register(registerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }
    @PostMapping("/v1/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authenticationService.login(loginRequestDto));
    }


}
