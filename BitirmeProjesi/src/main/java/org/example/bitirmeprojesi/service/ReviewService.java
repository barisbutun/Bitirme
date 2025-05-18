package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CommentDto;
import org.example.bitirmeprojesi.dto.ReviewDto;
import org.example.bitirmeprojesi.entity.Comment;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.Review;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.DuplicateReviewException;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.exception.error.ReviewNotFoundException;
import org.example.bitirmeprojesi.mapper.ReviewMapper;
import org.example.bitirmeprojesi.repository.CommentRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.repository.ReviewRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CommentService commentService;
    private final CommentRepository commentRepository;


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


        double averageRating = calculateAverageRating(productId);

        product.setTotalRating(reviewDto.getRating() + product.getTotalRating());
        product.setAverageRating(averageRating);

        product.setReviewCount(product.getReviewCount()+1);
        productRepository.saveAndFlush(product);

        review.setProduct(product);
        review.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR)));

        CommentDto commentDto = new CommentDto();
        commentDto.setContent("");
        commentDto.setProductId(productId);
        commentService.create(commentDto, userId);

        return reviewMapper.toDto(reviewRepository.save(review));
    }

    public ReviewDto findById(Long id) {
        return reviewMapper.toDto(reviewRepository.findById(id).orElseThrow(() -> new ReviewNotFoundException(ErrorMesage.REVIEW_NOT_FOUND_ERROR)));
    }

    public List<ReviewDto> findAll() {
        return reviewMapper.toDtoList(reviewRepository.findAll());
    }


    public Page<ReviewDto> findAllByProductId(Long productId,int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));
        return reviewRepository.findAllByProductId(product.getId(),pageable)
                .map(reviewMapper::toDto);
    }

    public Page<ReviewDto> findAllByUserId(int page , int size) {

        Pageable pageable = PageRequest.of(page, size);

        UUID userId = JwtUtil.getUserIdFromToken();
        return reviewRepository.findAllByUserId(userId,pageable)
                .map(reviewMapper::toDto);
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

        if (review.getComment() != null) {
            Optional<Comment> comment = commentRepository.findById(review.getComment().getId());
            comment.ifPresent(c -> {
                c.setReview(review);
                commentRepository.save(c);
            });
        }

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
