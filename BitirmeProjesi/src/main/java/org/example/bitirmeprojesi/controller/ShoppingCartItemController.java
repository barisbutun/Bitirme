package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.service.ShoppingCartItemService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shoppingCartItem")
@RequiredArgsConstructor
public class ShoppingCartItemController {

    private final ShoppingCartItemService shoppingCartItemService;


    @PostMapping("/v1")
    public ResponseEntity<Void> create(@RequestBody ShoppingCartItemDto shoppingCartItemDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        shoppingCartItemService.create(shoppingCartItemDto, userId);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        UUID userId = JwtUtil.getUserIdFromToken();
        shoppingCartItemService.delete(userId,id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/v1/user")
    public ResponseEntity<Page<ShoppingCartItemDto>> findAllByUserId(@RequestParam(required = false, defaultValue = "0") int page,
                                                                      @RequestParam(required = false, defaultValue = "10") int size) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok().body(shoppingCartItemService.findAllByUserId(userId, page, size));
    }


    @PutMapping("/v1/{id}")
    public ResponseEntity<ShoppingCartItemDto> update(@PathVariable Long id,@RequestBody ShoppingCartItemDto shoppingCartItemDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok().body(shoppingCartItemService.update(shoppingCartItemDto,id,userId));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<ShoppingCartItemDto> findById(long id) {
        return ResponseEntity.ok().body(shoppingCartItemService.findById(id));
    }

    @DeleteMapping("/v1/user")
    public ResponseEntity<ShoppingCartItemDto> deleteAllByUserId() {
        UUID userId = JwtUtil.getUserIdFromToken();
        shoppingCartItemService.deleteAllByUserId(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
