package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CategoryDto;
import org.example.bitirmeprojesi.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/v1")
    public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.create(categoryDto));
    }

    @GetMapping("/v1")
    public ResponseEntity<List<CategoryDto>> findAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<CategoryDto> findById(Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<CategoryDto> update(CategoryDto categoryDto, long id) {
        return ResponseEntity.ok(categoryService.update(categoryDto, id));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
