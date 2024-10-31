package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CategoryDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.service.CategoryService;
import org.example.bitirmeprojesi.service.OrderService;
import org.example.bitirmeprojesi.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;

    @GetMapping("/v1")
    public String success(){
        return "success admin";
    }

    @PostMapping("/v1/product")
    public ResponseEntity<ProductDto> createProduct(@RequestBody @Validated final ProductDto productDto) {
        productService.create(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productDto);
    }

    @PostMapping("/v1/category")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(categoryDto));
    }


    @GetMapping("/v1/orders")
    public ResponseEntity<List<OrdersDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }
}

