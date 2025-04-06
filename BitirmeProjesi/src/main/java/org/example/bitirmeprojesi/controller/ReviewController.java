package org.example.bitirmeprojesi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ReviewDto;
import org.example.bitirmeprojesi.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/v1")
    public ResponseEntity<ReviewDto> create(@Valid @RequestBody ReviewDto reviewDto) {
        return ResponseEntity.ok(reviewService.create(reviewDto));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<ReviewDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.findById(id));
    }


    @GetMapping("/v1/product/{productId}")
    public ResponseEntity<List<ReviewDto>> findAllByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.findAllByProductId(productId));
    }

    @GetMapping("/v1/user")
    public ResponseEntity<List<ReviewDto>> findAllByUserId() {
        return ResponseEntity.ok(reviewService.findAllByUserId());
    }


    @PutMapping("/v1/{id}")
    public ResponseEntity<ReviewDto> update(@PathVariable Long id, @RequestBody ReviewDto reviewDto) {
        return ResponseEntity.ok(reviewService.update(id, reviewDto));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
