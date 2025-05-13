package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.service.FavouriteService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/favourite")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;

    @PostMapping("/v1")
    public ResponseEntity<List<FavouriteDto>> create(@RequestBody FavouriteDto favouriteDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(favouriteService.create(favouriteDto, userId));
    }

    @GetMapping("/v1/getAllByUserId")
    public ResponseEntity<Page<FavouriteDto>> getlAllByUserId(@RequestParam(required = false, defaultValue = "0") int page,
                                                              @RequestParam(required = false, defaultValue = "10") int size) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(favouriteService.getlAllByUserId(userId, page, size));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<FavouriteDto> findById(@PathVariable long id) {
        return ResponseEntity.ok(favouriteService.findById(id));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        UUID userId = JwtUtil.getUserIdFromToken();
        favouriteService.delete(userId,id);
        return ResponseEntity.noContent().build();
    }

}
