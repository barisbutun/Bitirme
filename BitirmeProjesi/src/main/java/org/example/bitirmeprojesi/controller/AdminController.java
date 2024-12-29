package org.example.bitirmeprojesi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.*;
import org.example.bitirmeprojesi.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;


    @PostMapping("/v1/product")
    public ResponseEntity<ProductDto> createProduct(
           @Valid @RequestBody ProductDto productDto) throws Exception {
       adminService.createProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productDto);
    }

    @PutMapping("/v1/product/{id}")
    public ResponseEntity<ProductDto> updateProduct(@RequestBody ProductDto productDto, @PathVariable Long id) {
        ProductDto updatedProduct = adminService.updateProduct(productDto, id);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/v1/product/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.noContent().build();

    }
    @PostMapping("/v1/category")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        CategoryDto createdCategory = adminService.createCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PutMapping("/v1/category/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@RequestBody CategoryDto categoryDto, @PathVariable Long id) {
        CategoryDto updatedCategory = adminService.updateCategory(categoryDto, id);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/v1/category/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/v1/orders")
    public ResponseEntity<List<OrdersDto>> getAllOrders() {
        List<OrdersDto> orders = adminService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/v1/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        adminService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/v1/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = adminService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/v1/image/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable long id) {
        adminService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/v1")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file, @RequestParam("productId") Long productId) throws Exception {
        ImageResponseDto response = adminService.uploadImage(file, productId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(response);
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<FavouriteDto> update(@RequestBody FavouriteDto favouriteDto, @PathVariable long id) {
        return ResponseEntity.ok(adminService.updateFavourite(favouriteDto, id));
    }

    @GetMapping("/v1/findAll")
    public ResponseEntity<List<FavouriteDto>> findAllFavourites() {
        return ResponseEntity.ok(adminService.getAllFavourites());
    }

}

