package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, Long> {

    void deleteAllByUserId(UUID userId);

}
