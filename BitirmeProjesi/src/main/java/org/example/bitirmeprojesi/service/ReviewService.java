package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ReviewDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.Review;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.DuplicateReviewException;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.exception.error.ReviewNotFoundException;
import org.example.bitirmeprojesi.mapper.ReviewMapper;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.repository.ReviewRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;


    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "products_list", allEntries = true)
    })
    public ReviewDto create(ReviewDto reviewDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        Review review = reviewMapper.toEntity(reviewDto);

        Long productId = reviewDto.getProductId();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

        boolean userHasReviewed = reviewRepository.existsByProductIdAndUserId(productId, userId);

        if (userHasReviewed) {
            throw new DuplicateReviewException(ErrorMesage.INVALID_REVIEW_INFORMATION_ERROR);
        }

        double averageRating = calculateAverageRating(productId);

        product.setTotalRating(reviewDto.getRating() + product.getTotalRating());
        product.setAverageRating(averageRating);

        product.setReviewCount(product.getReviewCount()+1);
        productRepository.saveAndFlush(product);

        review.setProduct(product);
        review.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR)));

        return reviewMapper.toDto(reviewRepository.save(review));
    }

    public ReviewDto findById(Long id) {
        return reviewMapper.toDto(reviewRepository.findById(id).orElseThrow(() -> new ReviewNotFoundException(ErrorMesage.REVIEW_NOT_FOUND_ERROR)));
    }

    public List<ReviewDto> findAll() {
        return reviewMapper.toDtoList(reviewRepository.findAll());
    }


    public List<ReviewDto> findAllByProductId(Long productId) {
        return reviewMapper.toDtoList(reviewRepository.findAllByProductId(productId));
    }

    public List<ReviewDto> findAllByUserId() {
        UUID userId = JwtUtil.getUserIdFromToken();
        return reviewMapper.toDtoList(reviewRepository.findAllByUserId(userId));
    }

    private double calculateAverageRating(Long productId) {
        List<Review> reviews = reviewRepository.findAllByProductId(productId);

               return reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
    }
    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "products_list", allEntries = true)
    })
    public ReviewDto update(Long id, ReviewDto reviewDto) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(ErrorMesage.REVIEW_NOT_FOUND_ERROR));

        reviewMapper.update(reviewDto, review);
        reviewRepository.save(review);
        review.getProduct().setAverageRating(calculateAverageRating(review.getProduct().getId()));
        review.getProduct().setTotalRating(review.getProduct().getTotalRating() - review.getRating() + reviewDto.getRating());
        productRepository.save(review.getProduct());

        return reviewMapper.toDto(review);
    }
    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "products_list", allEntries = true)
    })
    public void delete(Long id) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new ReviewNotFoundException(ErrorMesage.REVIEW_NOT_FOUND_ERROR));
        reviewRepository.deleteById(id);
        review.getProduct().setReviewCount(review.getProduct().getReviewCount() - 1);
        review.getProduct().setTotalRating(review.getProduct().getTotalRating() - review.getRating());
        review.getProduct().setAverageRating(calculateAverageRating(review.getProduct().getId()));
        productRepository.save(review.getProduct());

    }


}
