package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.AnalyzeReportDto;
import org.example.bitirmeprojesi.service.AnalyzeReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/analyzeReport")
@RequiredArgsConstructor
public class AnalyzeReportController {

    private final AnalyzeReportService analyzeReportService;

    @PostMapping("/v1")
    public ResponseEntity<AnalyzeReportDto> create(@RequestBody AnalyzeReportDto analyzeReportDto) {
        return ResponseEntity.ok(analyzeReportService.create(analyzeReportDto));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<AnalyzeReportDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(analyzeReportService.findById(id));
    }

    @GetMapping("/v1")
    public ResponseEntity<List<AnalyzeReportDto>> findAll() {
        return ResponseEntity.ok(analyzeReportService.findAll());
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<AnalyzeReportDto> update(@RequestBody AnalyzeReportDto analyzeReportDto,@PathVariable Long id) {
        return ResponseEntity.ok(analyzeReportService.update(analyzeReportDto, id));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        analyzeReportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
