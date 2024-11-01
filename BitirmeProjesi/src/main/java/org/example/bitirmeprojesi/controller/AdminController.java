package org.example.bitirmeprojesi.controller;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CategoryDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/v1")
    public String success() {
        return "success admin";
    }

    @PostMapping("/v1/product")
    public ResponseEntity<ProductDto> createProduct(@RequestBody @Validated final ProductDto productDto) {
        ProductDto createdProduct = adminService.createProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PostMapping("/v1/category")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        CategoryDto createdCategory = adminService.createCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @GetMapping("/v1/orders")
    public ResponseEntity<List<OrdersDto>> getAllOrders() {
        List<OrdersDto> orders = adminService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

}

