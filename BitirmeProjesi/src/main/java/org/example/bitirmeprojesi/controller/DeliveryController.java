package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.DeliveryDto;
import org.example.bitirmeprojesi.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/delivery")
@RequiredArgsConstructor
public class DeliveryController {
    private final DeliveryService deliveryService;

    @PostMapping("/v1")
    public ResponseEntity<DeliveryDto> create(DeliveryDto deliveryDto) {
        return ResponseEntity.ok(deliveryService.create(deliveryDto));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<DeliveryDto> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(deliveryService.findById(id));
    }

    @GetMapping("/v1")
    public ResponseEntity<List<DeliveryDto>> findAll() {
        return ResponseEntity.ok(deliveryService.findAll());
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<DeliveryDto> update(@RequestBody DeliveryDto deliveryDto,@PathVariable UUID id) {

        return ResponseEntity.ok(deliveryService.update(deliveryDto, id));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        deliveryService.delete(id);
        return ResponseEntity.ok().build();
    }


}
