package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.PaymentDto;
import org.example.bitirmeprojesi.service.PaymentService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/v1")
    public ResponseEntity<PaymentDto> create(@RequestBody PaymentDto paymentDto) {
        return ResponseEntity.ok(paymentService.create(paymentDto));
    }

    @GetMapping("/v1")
    public ResponseEntity<Page<PaymentDto>> findAll(@RequestParam(required = false, defaultValue = "0") int page,
                                                     @RequestParam(required = false, defaultValue = "10") int size) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(paymentService.findAllByUserId(userId, page, size));
    }
}
