package org.example.bitirmeprojesi.controller;

import com.nimbusds.oauth2.sdk.util.JWTClaimsSetUtils;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.service.ShoppingCartItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/shoppingCartItem")
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

    @GetMapping("/v1/user")
    private ResponseEntity<List<ShoppingCartItemDto>> findAllByUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) authentication.getPrincipal();

        return ResponseEntity.ok().body(shoppingCartItemService.findAllByUserId(userId));
    }

    @GetMapping("/v1/{id}")
    private ResponseEntity<ShoppingCartItemDto> findById(long id) {
        return ResponseEntity.ok().body(shoppingCartItemService.findById(id));
    }

    @DeleteMapping("/v1/user")
    private ResponseEntity<ShoppingCartItemDto> deleteAllByUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = (UUID) authentication.getPrincipal();
        shoppingCartItemService.deleteAllByUserId(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
