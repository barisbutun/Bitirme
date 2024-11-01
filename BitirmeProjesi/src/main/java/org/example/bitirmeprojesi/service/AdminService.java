package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CategoryDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final UserService userService;

    public ProductDto createProduct(ProductDto productDto) {
        return productService.create(productDto);
    }

    public CategoryDto createCategory(CategoryDto categoryDto) {
        return categoryService.create(categoryDto);
    }

    public List<OrdersDto> getAllOrders() {
        return orderService.findAll();
    }

    public void deleteProduct(Long id) {
        productService.delete(id);
    }

    public void deleteCategory(Long id) {
        categoryService.delete(id);
    }

    public void deleteOrder(Long id) {
        orderService.delete(id);
    }

    public ProductDto updateProduct(ProductDto productDto, Long id) {
        return productService.update(productDto, id);
    }

    public CategoryDto updateCategory(CategoryDto categoryDto, Long id) {
        return categoryService.update(categoryDto, id);
    }

    public List<UserDto> findAllUsers() {
        return userService.findAll();
    }
}
