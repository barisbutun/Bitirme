package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.RefundDto;
import org.example.bitirmeprojesi.service.RefundService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/refund")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    @PostMapping("/v1")
    public ResponseEntity<RefundDto> create(@RequestBody RefundDto refundDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(refundService.create(refundDto, userId));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<RefundDto> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(refundService.findById(id));
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<RefundDto> update(@PathVariable("id") UUID id, @RequestBody RefundDto refundDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(refundService.update(refundDto, id, userId));
    }

    @GetMapping("/v1/user")
    public ResponseEntity<List<RefundDto>> findAllByUserId() {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(refundService.findAllByUserId(userId));
    }
}
