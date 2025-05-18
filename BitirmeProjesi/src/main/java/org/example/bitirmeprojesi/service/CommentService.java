package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CommentDto;
import org.example.bitirmeprojesi.entity.Comment;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.Review;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.CommentAccessDeniedException;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.mapper.CommentMapper;
import org.example.bitirmeprojesi.mapper.ReviewMapper;
import org.example.bitirmeprojesi.repository.CommentRepository;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final ReviewMapper reviewMapper;

    @Transactional
    public CommentDto create(CommentDto commentDto, UUID userId) {
        Comment comment = commentMapper.toEntity(commentDto);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        comment.setUser(user);

        Product product = productRepository.findById(commentDto.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

        comment.setProduct(product);

        boolean isPurchased = orderItemRepository.existsByUserIdAndProductId(userId, comment.getProduct().getId());

        comment.setPurchased(isPurchased);
        comment.setUserName(user.getName());

        if (commentDto.getReview() != null) {
            Review review = reviewMapper.toEntity(commentDto.getReview());
            review.setComment(comment);
            review.setUser(user);
            review.setProduct(product);

            comment.setReview(review);
        }
        if(commentRepository.CountByUserIdAndProductId(userId, comment.getProduct().getId()) > 5) {
            throw new CommentAccessDeniedException(ErrorMesage.COMMENT_LIMIT_EXCEEDED_ERROR);
        }

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }

    public CommentDto findById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        return commentMapper.toDto(comment);
    }


    public Page<CommentDto> findAll(int page, int size) {

        Sort sort = getSort();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Comment> comments = commentRepository.findAll(pageable);

        return comments.map(commentMapper::toDto);
    }

    public Page<CommentDto> findAllByProductId(Long productId, int page, int size) {
        Sort sort = getSort();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Comment> comments = commentRepository.findAllByProductId(productId, pageable);

        return comments.map(commentMapper::toDto);
    }

    public Page<CommentDto> findAllByUserId(UUID userId, int page, int size) {
        Sort sort = getSort();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Comment> comments = commentRepository.findAllByUserId(userId, pageable);

        return comments.map(commentMapper::toDto);
    }

    public void deleteById(Long id, UUID userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        if (!comment.getUser().getId().equals(userId)) {
            throw new CommentAccessDeniedException(ErrorMesage.ACCESS_DENIED_ERROR);
        }

        commentRepository.deleteById(id);
    }

    public Integer countByProductId(Long productId) {
        return commentRepository.countByProductId(productId);
    }


    @Transactional
    public CommentDto update(CommentDto commentDto, Long commentId, UUID userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        if (!comment.getUser().getId().equals(userId)) {
            throw new CommentAccessDeniedException(ErrorMesage.ACCESS_DENIED_ERROR);
        }

        comment.setContent(commentDto.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.toDto(updatedComment);
    }

    private Sort getSort() {
        return Sort.by(Sort.Order.desc("createdAt"));
    }


}
