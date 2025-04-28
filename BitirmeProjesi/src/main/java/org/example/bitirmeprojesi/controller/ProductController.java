package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/v1/{id}")
    public ResponseEntity<ProductDto> findById(@PathVariable final Long id) {
        ProductDto product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<Page<ProductDto>> getTopRatedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ProductDto> topRatedProducts = productService.getTopRatedProducts(page, size);
        return ResponseEntity.ok(topRatedProducts);
    }

    @GetMapping("/rated-only")
    public ResponseEntity<List<ProductDto>> getRatedProductsOnly(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<ProductDto> ratedProducts = productService.getRatedProductsOnly(page, size);
        return ResponseEntity.ok(ratedProducts);
    }


    @GetMapping("/{productId}/reviews/count")
    public ResponseEntity<Integer> getReviewCount(@PathVariable Long productId) {
        int reviewCount = productService.getReviewCountForProduct(productId);
        return ResponseEntity.ok(reviewCount);
    }

    @GetMapping("/v1/home")
    public ResponseEntity<Page<ProductDto>> findAll(@RequestParam(required = false, defaultValue = "0") int page,
                                                    @RequestParam(required = false, defaultValue = "10") int size) {
        Page<ProductDto> products = productService.findAll(page, size);
        return ResponseEntity.ok(products);
    }


    @PutMapping("/v1/{id}")
    public ResponseEntity<ProductDto> update(@PathVariable final Long id, @RequestBody final ProductDto productDto) {

        ProductDto updatedProduct = productService.update(productDto, id);
        return ResponseEntity.ok(updatedProduct);
    }

    @GetMapping("/v1/filter")
    public ResponseEntity<List<ProductDto>> filter(@RequestParam(required = false) String name,
                                                   @RequestParam(required = false) String category,
                                                   @RequestParam(required = false) Double minPrice,
                                                   @RequestParam(required = false) Double maxPrice) {
        List<ProductDto> products = productService.filterbyProduct(name, category, minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable final Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
