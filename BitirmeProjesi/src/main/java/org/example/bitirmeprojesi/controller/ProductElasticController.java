package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.dto.QueryRequest;
import org.example.bitirmeprojesi.service.ProductElasticService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/productElastic")
@RestController
@RequiredArgsConstructor
public class ProductElasticController {

    private final ProductElasticService productElasticService;

    @PostMapping("/v1/autocomplete")
    public ResponseEntity<List<ProductDto>> searchByQuery(@RequestBody QueryRequest query) {
        List<ProductDto> products = productElasticService.searchByQuery(query);
        return ResponseEntity.ok(products);
    }
    @GetMapping("v1/filter")
    public ResponseEntity<List<ProductDto>> searchByFilters(@RequestParam(required = false) Integer category, @RequestParam(required = false) String name, @RequestParam(required = false) Double minPrice, @RequestParam(required = false) Double maxPrice) {

        List<ProductDto> products = productElasticService.searchByFilters(category, name, minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }




}
