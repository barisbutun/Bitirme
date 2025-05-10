package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.BalanceTransactionResponseDto;
import org.example.bitirmeprojesi.service.BalanceService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/balance")
@RequiredArgsConstructor
public class BalanceController {

    private final BalanceService balanceService;

    @GetMapping("/v1/history")
    public ResponseEntity<Page<BalanceTransactionResponseDto>> getBalanceHistory(@RequestParam(defaultValue = "0", required = false) int page
            , @RequestParam(defaultValue = "10", required = false) int size) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(balanceService.getBalanceHistory(userId, page, size));
    }

}
