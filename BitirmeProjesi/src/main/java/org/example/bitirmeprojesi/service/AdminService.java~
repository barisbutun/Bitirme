package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final UserService userService;
    private final ImageService imageService;
    private final FavouriteService favouriteService;

    public ProductDto createProduct(ProductDto productDto) throws Exception {
        return productService.create(productDto);
    }

    public CategoryDto createCategory(CategoryDto categoryDto) {
        return categoryService.create(categoryDto);
    }

    public List<OrdersDto> getAllOrders(int page,int size) {
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


}
