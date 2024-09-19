package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    @PostMapping("/v1")
    public ResponseEntity<Long> create(@RequestBody ProductDto productDto) {
        Long productId = productService.create(productDto);
        return ResponseEntity.ok(productId);
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<ProductDto> findById(@PathVariable Long id) {
        ProductDto product = productService.findById(id);
        return ResponseEntity.ok(product);
    }


    @GetMapping("/v1")
    public ResponseEntity<List<ProductDto>> getAll() {
        List<ProductDto> products = productService.findAll();
        return ResponseEntity.ok(products);
    }

    // Update a product by id
    @PutMapping("/v1/{id}")
    public ResponseEntity<ProductDto> update(@PathVariable Long id, @RequestBody ProductDto productDto) {

        ProductDto updatedProduct = productService.update(productDto, id);
        return ResponseEntity.ok(updatedProduct);
    }

    // Delete a product by id
    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build(); // 204 No Content döner
    }
}
