package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.dto.UserPatchDto;
import org.example.bitirmeprojesi.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/v1")
    public ResponseEntity<UserDto> create(@RequestBody UserDto userDto) {
         userService.create(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable("id") UUID id) {
        UserDto userDto = userService.findById(id);
        if (userDto != null) {
            return ResponseEntity.ok(userDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/v1")
    public ResponseEntity<List<UserDto>> findAll() {
        List<UserDto> userDtos = userService.findAll();
        return ResponseEntity.ok(userDtos);
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
