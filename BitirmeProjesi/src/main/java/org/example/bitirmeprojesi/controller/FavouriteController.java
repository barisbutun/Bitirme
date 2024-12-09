package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.service.FavouriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/favourite")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;

    @PostMapping("/v1")
    public ResponseEntity<FavouriteDto> create(@RequestBody FavouriteDto favouriteDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        return ResponseEntity.ok(favouriteService.create(favouriteDto, userId));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<FavouriteDto> findById(long id) {
        return ResponseEntity.ok(favouriteService.findById(id));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        favouriteService.delete(id);
        return ResponseEntity.noContent().build();
    }




}
