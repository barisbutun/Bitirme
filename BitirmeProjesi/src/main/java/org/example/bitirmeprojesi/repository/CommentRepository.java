package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;


public interface CommentRepository extends JpaRepository<Comment,Long> {

    Page<Comment> findAllByProductId(Long productId, Pageable pageable);

    Page<Comment> findAllByUserId(UUID userId, Pageable pageable);

    List<Comment> findAllByUserId(UUID userId);

    Integer countByProductId(Long productId);

}
