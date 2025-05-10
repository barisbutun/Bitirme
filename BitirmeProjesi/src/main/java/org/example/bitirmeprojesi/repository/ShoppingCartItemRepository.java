package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.example.bitirmeprojesi.enums.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, Long> {

    @Query("SELECT o FROM ShoppingCartItem o WHERE o.user.id = :userId")
    List<ShoppingCartItem> findByUserId(@Param("userId") UUID userId);

    @Modifying
    @Query("DELETE FROM ShoppingCartItem o WHERE o.user.id = :userId")
    void deleteAllByUserId(@Param("userId") UUID userId);

    boolean existsByUserIdAndProductIdAndSize(UUID userId, Long productId, Size size);

    Page<ShoppingCartItem> findByUserId(UUID userId, Pageable pageable);

}
