package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.dto.QueryRequest;
import org.example.bitirmeprojesi.service.ProductElasticService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/productElastic")
@RestController
@RequiredArgsConstructor
public class ProductElasticController {

    private final ProductElasticService productElasticService;

    @PostMapping("/v1/autocomplete")
    public ResponseEntity<List<ProductDto>> searchByQuery(@RequestBody QueryRequest query) {
        List<ProductDto> products = productElasticService.searchByQuery(query.getQuery());
        return ResponseEntity.ok(products);
    }
    @PostMapping("/v1/searchByNameOrDescription")
    public ResponseEntity<List<ProductDto>> searchByNameOrDescription(Map<String, String> searchQuery) {

       String name=searchQuery.get("name");
       String description=searchQuery.get("description");

        List<ProductDto> products = productElasticService.findByNameOrDescription(name,description);
        return ResponseEntity.ok(products);
    }



}
