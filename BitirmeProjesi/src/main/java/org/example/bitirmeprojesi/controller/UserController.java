package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.dto.UserPatchDto;
import org.example.bitirmeprojesi.dto.UserProfileDto;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.service.UserService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;



    @GetMapping("/v1")
    public ResponseEntity<List<UserDto>> findAll() {
        List<UserDto> userDtos = userService.findAll();
        return ResponseEntity.ok(userDtos);
    }



    @GetMapping("/v1/profile")
    public ResponseEntity<UserProfileDto> getProfile() {
        UUID userId = JwtUtil.getUserIdFromToken();
        UserProfileDto userProfileDto = userService.getUserProfile(userId);
        return ResponseEntity.ok(userProfileDto);
    }

    @DeleteMapping("/v1")
    public ResponseEntity<Void> delete() {
        UUID userId = JwtUtil.getUserIdFromToken();
        userService.delete(userId);
        return ResponseEntity.noContent().build();
    }



    @PatchMapping("/v1")
    public ResponseEntity<UserPatchDto> patch (@RequestBody UserPatchDto userPatchDto) {
        UUID userId = JwtUtil.getUserIdFromToken();

        UserPatchDto updatedUserDto = userService.updateUserPartially(userPatchDto, userId);
        if (updatedUserDto != null) {
            return ResponseEntity.ok(updatedUserDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


}
