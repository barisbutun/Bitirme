package org.example.bitirmeprojesi.repository;


import org.example.bitirmeprojesi.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    int countByProductId(@Param("productId") Long productId);

    @Query("SELECT r FROM Review r WHERE r.product.id = :productId")
    List<Review> findAllByProductId(Long productId);

    @Query("SELECT r FROM Review r WHERE r.user.id = :userId")
    List<Review> findAllByUserId(UUID userId);


    boolean existsByProductIdAndUserId(Long productId,UUID userId);
}
