package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.service.ShoppingCartItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shoppingCartItem")
@RequiredArgsConstructor
public class ShoppingCartItemController {

    private final ShoppingCartItemService shoppingCartItemService;


    @PostMapping("/v1")
    private ResponseEntity<Void> create(@RequestBody ShoppingCartItemDto shoppingCartItemDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));

        shoppingCartItemService.create(shoppingCartItemDto, userId);
        System.out.println(userId);

        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/v1/{id}")
    private ResponseEntity<Void> delete(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        shoppingCartItemService.delete(userId,id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/v1/user")
    private ResponseEntity<List<ShoppingCartItemDto>> findAllByUserId(@RequestParam(required = false, defaultValue = "0") int page,
                                                                      @RequestParam(required = false, defaultValue = "10") int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));

        return ResponseEntity.ok().body(shoppingCartItemService.findAllByUserId(userId, page, size));
    }


    @PutMapping("/v1/{id}")
    private ResponseEntity<ShoppingCartItemDto> update(@PathVariable Long id,@RequestBody ShoppingCartItemDto shoppingCartItemDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        return ResponseEntity.ok().body(shoppingCartItemService.update(shoppingCartItemDto,id,userId));
    }

    @GetMapping("/v1/{id}")
    private ResponseEntity<ShoppingCartItemDto> findById(long id) {
        return ResponseEntity.ok().body(shoppingCartItemService.findById(id));
    }

    @DeleteMapping("/v1/user")
    private ResponseEntity<ShoppingCartItemDto> deleteAllByUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        UUID userId = UUID.fromString(jwt.getClaimAsString("userId"));
        shoppingCartItemService.deleteAllByUserId(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
