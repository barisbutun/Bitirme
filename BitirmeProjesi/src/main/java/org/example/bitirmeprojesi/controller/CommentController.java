package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CommentDto;
import org.example.bitirmeprojesi.service.CommentService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/v1")
    public ResponseEntity<CommentDto> create(@RequestBody CommentDto commentDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(commentService.create(commentDto, userId));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<CommentDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.findById(id));
    }

    @GetMapping("/v1/user")
    public ResponseEntity<Page<CommentDto>> findAllUser(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {

        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(commentService.findAllByUserId(userId, page, size));

    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<CommentDto> update(@RequestBody CommentDto commentDto, @PathVariable Long id) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(commentService.update(commentDto, id, userId));
    }

    @GetMapping("/v1/count")
    public ResponseEntity<Integer> countByProductId(@RequestParam Long productId) {
        return ResponseEntity.ok(commentService.countByProductId(productId));
    }

    @GetMapping("/v1/product/{id}")
    public ResponseEntity<Page<CommentDto>> findAllByProductId(@PathVariable Long id,
                                                               @RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(commentService.findAllByProductId(id, page, size));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        UUID userId = JwtUtil.getUserIdFromToken();
        commentService.deleteById(id, userId);
        return ResponseEntity.ok().build();
    }
}
