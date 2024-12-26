package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.service.ProductElasticService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/productElastic")
@RestController
@RequiredArgsConstructor
public class ProductElasticController {

    private final ProductElasticService productElasticService;

    @GetMapping("/v1/search")
    public ResponseEntity<List<ProductDto>> searchByQuery(@RequestParam(required = true) String query) {
        List<ProductDto> products = productElasticService.searchByQuery(query);
        return ResponseEntity.ok(products);
    }


}
