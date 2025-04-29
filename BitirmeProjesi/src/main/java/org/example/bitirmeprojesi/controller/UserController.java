package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.dto.UserPatchDto;
import org.example.bitirmeprojesi.dto.UserProfileDto;
import org.example.bitirmeprojesi.service.UserService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


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

    @PutMapping("/v1/balance")
    public ResponseEntity<UserDto> update(@RequestBody UserDto userDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        userService.uploadBalance(userId, userDto);
        return ResponseEntity.ok(userDto);

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
