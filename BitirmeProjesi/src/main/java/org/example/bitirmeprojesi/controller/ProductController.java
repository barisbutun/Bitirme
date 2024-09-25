package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    @PostMapping("/v1")
    public ResponseEntity<ProductDto> create(@RequestBody @Validated final  ProductDto productDto) {
          productService.create(productDto);

        return ResponseEntity.ok(productDto);
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<ProductDto> findById(@PathVariable final  Long id) {
        ProductDto product = productService.findById(id);
        return ResponseEntity.ok(product);
    }


    @GetMapping("/v1")
    public ResponseEntity<List<ProductDto>> getAll() {
        List<ProductDto> products = productService.findAll();
        return ResponseEntity.ok(products);
    }


    @PutMapping("/v1/{id}")
    public ResponseEntity<ProductDto> update(@PathVariable final Long id, @RequestBody final  ProductDto productDto) {

        ProductDto updatedProduct = productService.update(productDto, id);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable final Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build(); // 204 No Content döner
    }
}
