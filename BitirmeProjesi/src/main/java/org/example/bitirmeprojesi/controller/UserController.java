package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/v1")
    public Long create(@RequestBody UserDto userDto){
        return userService.create(userDto);
    }
    @GetMapping("/v1/{id}")
    public UserDto findById(@PathVariable("id") Long id) {
        return userService.findById(id);
    }
    @GetMapping("/v1")
    public List<UserDto> findAll() {
        return userService.findAll();
    }@PutMapping("/v1/{id}")
    public UserDto update(@PathVariable("id") Long id, @RequestBody UserDto userDto){return userService.update(userDto);}
    @DeleteMapping("/v1/{id}")
    public void delete(@PathVariable("id") Long id){
        userService.delete(id);
    }

}
