package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.service.CancellationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cancellation")
@RequiredArgsConstructor
public class CancellationController {

    private final CancellationService cancellationService;

    @PostMapping("/v1")
    public ResponseEntity<CancellationDto> create(@RequestBody CancellationDto cancellationDto) {
        return ResponseEntity.ok(cancellationService.create(cancellationDto));
    }
    @GetMapping("/v1/{id}")
    public ResponseEntity<CancellationDto> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(cancellationService.findById(id));
    }


    @GetMapping("/v1")
    public ResponseEntity<List<CancellationDto>> findAll() {
        return ResponseEntity.ok(cancellationService.findAll());
    }
    @PutMapping("/v1/{id}")
    public ResponseEntity<CancellationDto> update(@PathVariable("id") Long id, @RequestBody CancellationDto cancellationDto){
        return ResponseEntity.ok(cancellationService.update(cancellationDto,id));
    }
    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        cancellationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
