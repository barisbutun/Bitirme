package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.service.CancellationService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/api/cancellation")
@RequiredArgsConstructor
public class CancellationController {

    private final CancellationService cancellationService;

    @PostMapping("/v1")
    public ResponseEntity<CancellationDto> create(@RequestBody CancellationDto cancellationDto) {

        UUID userId = JwtUtil.getUserIdFromToken();

        return ResponseEntity.ok(cancellationService.create(cancellationDto,userId));
    }

    @PostMapping("v1/all")
    public ResponseEntity<CancellationDto> createAll(@RequestBody CancellationDto cancellationDtos) {
        UUID userId = JwtUtil.getUserIdFromToken();

        return ResponseEntity.ok(cancellationService.createAllOrdersCancellation(cancellationDtos, userId));
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<CancellationDto> update(@PathVariable("id") Long id, @RequestBody CancellationDto cancellationDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(cancellationService.update(id, cancellationDto, userId));
    }



    @GetMapping("/v1/{id}")
    public ResponseEntity<CancellationDto> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(cancellationService.findById(id));
    }
}
