package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;


public interface CommentRepository extends JpaRepository<Comment,Long> {

    Page<Comment> findAllByProductId(Long productId, Pageable pageable);

    Page<Comment> findAllByUserId(UUID userId, Pageable pageable);

    List<Comment> findAllByUserId(UUID userId);

    Integer countByProductId(Long productId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.user.id = :userId AND c.product.id = :productId")
    Integer CountByUserIdAndProductId(UUID userId, Long productId);

}
