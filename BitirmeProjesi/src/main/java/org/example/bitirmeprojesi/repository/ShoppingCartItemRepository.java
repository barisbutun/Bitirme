package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, Long> {

    @Query("SELECT o FROM ShoppingCartItem o WHERE o.user.id = :userId")
    List<ShoppingCartItem> findByUserId(@Param("userId") UUID userId);

    void deleteAllByUserId(UUID userId);

}
