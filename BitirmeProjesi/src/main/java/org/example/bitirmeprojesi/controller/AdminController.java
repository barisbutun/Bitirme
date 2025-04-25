package org.example.bitirmeprojesi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.*;
import org.example.bitirmeprojesi.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

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
    @GetMapping("/v1/product/count")
    public ResponseEntity<Integer> getProductCount() {
        return ResponseEntity.ok(adminService.getProductCount());
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
    @GetMapping("v1/category/count")
    public ResponseEntity<Integer> getCategoryCount() {
        return ResponseEntity.ok(adminService.getCategoryCount());
    }

    @GetMapping("/v1/category/count-product")
    public ResponseEntity<HashMap<String, Integer>> getCategoryCountMap() {
        return ResponseEntity.ok(adminService.getCategoryCountMap());
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
    public ResponseEntity<Page<OrdersDto>> getAllOrders(@RequestParam("page") int page,
                                                        @RequestParam("size") int size) {
        Page<OrdersDto> orders = adminService.getAllOrders(page, size);
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
    @GetMapping("/v1/user/count")
    public ResponseEntity<Integer> getUserCount() {
        return ResponseEntity.ok(adminService.getUserCount());
    }


    @PutMapping("/v1/user/{id}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto, @PathVariable UUID id) {
        UserDto updatedUser = adminService.updateUser(userDto, id);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/v1/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
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

    @GetMapping("/v1/favourites/findAll")
    public ResponseEntity<List<FavouriteDto>> findAllFavourites() {
        return ResponseEntity.ok(adminService.getAllFavourites());
    }

    @GetMapping("/v1/reviews/findall")
    public ResponseEntity<List<ReviewDto>> findAllReviews() {
        return ResponseEntity.ok(adminService.findAllReviews());
    }


}

