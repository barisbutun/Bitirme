package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.service.FavouriteService;
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
    public ResponseEntity<FavouriteDto> create(@RequestBody FavouriteDto favouriteDto, @RequestParam UUID userId) {
        return ResponseEntity.ok(favouriteService.create(favouriteDto, userId));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) {
        favouriteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<FavouriteDto> update(@RequestBody FavouriteDto favouriteDto, @PathVariable long id) {
        return ResponseEntity.ok(favouriteService.update(favouriteDto, id));
    }

    @GetMapping("/v1/findAll")
    public ResponseEntity<List<FavouriteDto>> findAll() {
        return ResponseEntity.ok(favouriteService.findAll());
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<FavouriteDto> findById(long id) {
        return ResponseEntity.ok(favouriteService.findById(id));
    }


}
