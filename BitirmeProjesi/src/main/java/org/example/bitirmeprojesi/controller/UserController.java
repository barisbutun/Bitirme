package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.dto.UserPatchDto;
import org.example.bitirmeprojesi.dto.UserProfileDto;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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


    @GetMapping("https://www.googleapis.com/oauth2/v2/userinfo")
    public ResponseEntity<String> googleRegister(@RequestBody UserDto userDto) {

        Optional<User> existingUser = userService.findUserByEmail(userDto.getEmail());
        if (existingUser != null) {
            return ResponseEntity.badRequest().body("Kullanıcı zaten mevcut.");
        }

        userService.googleRegister(userDto);
        return ResponseEntity.ok("Kullanıcı başarıyla kaydedildi.");

    }


    @GetMapping("v1/x")
    public String success() {
        return "success";
    }

    @GetMapping("/v1")
    public ResponseEntity<List<UserDto>> findAll() {
        List<UserDto> userDtos = userService.findAll();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/v1/register/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable("id") UUID id) {
        UserDto userDto = userService.findById(id);
        if (userDto != null) {
            return ResponseEntity.ok(userDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<UserDto> update(@PathVariable("id") UUID id, @RequestBody UserDto userDto) {
        UserDto updatedUserDto = userService.update(userDto, id);
        if (updatedUserDto != null) {
            return ResponseEntity.ok(updatedUserDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/v1/profile")
    public ResponseEntity<UserProfileDto> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Jwt nesnesini almak
        Jwt jwt = (Jwt) authentication.getPrincipal();

        // JWT içerisinden email'i almak
        String email = jwt.getClaimAsString("sub"); // sub alanı e-posta adresini tutuyor

        if (email == null) {
            throw new RuntimeException("User email not found in JWT");
        }

        UserProfileDto userProfileDto = userService.getUserProfile(email);
        return ResponseEntity.ok(userProfileDto);
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/v1/{id}")
    public ResponseEntity<UserPatchDto> patch(@PathVariable("id") UUID id, @RequestBody UserPatchDto userPatchDto) {
        UserPatchDto updatedUserDto = userService.updateUserPartially(userPatchDto, id);
        if (updatedUserDto != null) {
            return ResponseEntity.ok(updatedUserDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


}
