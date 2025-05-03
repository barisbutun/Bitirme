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
    private final PaymentService paymentService;
    private final CancellationService cancellationService;

    public Page<PaymentDto> findAllPayment(int page, int size) {
        return paymentService.findAll(page, size);
    }

    public Page<PaymentDto> findAllPaymentByUserId(UUID userId, int page, int size) {
        return paymentService.findAllByUserId(userId, page, size);
    }

    public Page<CancellationDto> findAllCancellationByUserId(UUID userId, int page, int size) {
        return cancellationService.findAllByUserId(userId, page, size);
    }

    public void deletePayment(UUID id) {
        paymentService.delete(id);
    }

    public Page<CancellationDto> findAllCancellation(int page, int size) {
        return cancellationService.findAll(page, size);
    }
    public CancellationDto updateCancellation(CancellationDto cancellationDto,Long id,UUID userId) {
        return cancellationService.update(cancellationDto, id,userId);
    }

    public PaymentDto updatePayment(PaymentDto paymentDto,UUID id,UUID userId) {
        return paymentService.update(paymentDto, id,userId);
    }

    public void deleteCancellation(Long id) {
        cancellationService.delete(id);
    }

    public ProductDto createProduct(ProductDto productDto) throws Exception {
        return productService.create(productDto);
    }

    public Integer getProductCount() {
        return productService.getProductCount();
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

    public Page<UserDto> findAllUsers(int page,int size) {
        return userService.findAll(page,size);
    }

    public void deleteUser(UUID id) {
        userService.deleteById(id);
    }

    public UserDto updateUser(UserDto userDto, UUID id) {
        return userService.update(userDto, id);
    }

    public Page<FavouriteDto> getAllFavourites(int page,int size) {
        return favouriteService.findAll(page,size);
    }

    public Page<FavouriteDto> getAllFavouritesByUserId(UUID userId,int page,int size) {
        return favouriteService.getlAllByUserId(userId, page, size);
    }

    public FavouriteDto updateFavourite(FavouriteDto favouriteDto, Long id) {
        return favouriteService.update(favouriteDto, id);
    }
    public Integer countFavouriteByUserId(UUID userId) {
        return favouriteService.getFavouriteCountByUserId(userId);
    }


    public List<ReviewDto> findAllReviews() {
        return reviewService.findAll();
    }


}
