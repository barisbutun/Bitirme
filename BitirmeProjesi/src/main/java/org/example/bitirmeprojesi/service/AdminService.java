package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final UserService userService;
    private final ImageService imageService;
    private final FavouriteService favouriteService;
    private final ReviewService reviewService;

    public ProductDto createProduct(ProductDto productDto) throws Exception {
        return productService.create(productDto);
    }

    public Integer getProductCount() {
        return productService.getProductCount();
    }

    public void deleteUser(UUID id) {
        userService.delete(id);
    }

    public UserDto updateUser(UserDto userDto, UUID id) {
        return userService.update(userDto, id);
    }
    public Integer getUserCount() {
        return userService.countUser();
    }


    public CategoryDto createCategory(CategoryDto categoryDto) {
        return categoryService.create(categoryDto);
    }

    public Integer getCategoryCount() {
        return categoryService.getCategoryCount();
    }

    public HashMap<String, Integer> getCategoryCountMap() {
        return categoryService.getCategoryCountMap();
    }


    public Page<OrdersDto> getAllOrders(int page, int size) {
        return orderService.findAll(page , size);
    }

    public void deleteImage(long id){
        imageService.delete(id);
    }

    public ImageResponseDto uploadImage(MultipartFile file, long productId) throws Exception {
        return imageService.upload(file, productId);
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

    public List<FavouriteDto> getAllFavourites() {
        return favouriteService.findAll();
    }

    public FavouriteDto updateFavourite(FavouriteDto favouriteDto, Long id) {
        return favouriteService.update(favouriteDto, id);
    }

    public List<ReviewDto> findAllReviews() {
        return reviewService.findAll();
    }


}
