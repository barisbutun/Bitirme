package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.service.ShoppingCartItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/shoppingCartItem")
@RequiredArgsConstructor
public class ShoppingCartItemController {

    private final ShoppingCartItemService shoppingCartItemService;

    @PostMapping("/v1")
    private ResponseEntity<ShoppingCartItemDto> create(@RequestBody ShoppingCartItemDto shoppingCartItemDto) {
        return ResponseEntity.ok().body(shoppingCartItemService.create(shoppingCartItemDto));
    }
    @DeleteMapping("/v1/{id}")
    private ResponseEntity<Void> delete(long id) {
        shoppingCartItemService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @DeleteMapping("/v1/user/{userId}")
    private ResponseEntity<Void> deleteAllByUserId(UUID userId) {
        shoppingCartItemService.deleteAllByUserId(userId);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
