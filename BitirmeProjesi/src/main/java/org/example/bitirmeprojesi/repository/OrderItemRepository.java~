package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT o FROM OrderItem o WHERE o.order.user.id = :userId")
    List<OrderItem> findByUserId(@Param("userId") UUID userId);

    @Modifying
    @Query("UPDATE OrderItem o SET o.shoppingCartItem = NULL WHERE o.shoppingCartItem.id = :itemId")
    void detachShoppingCartItem(@Param("itemId") Long itemId);

    OrderItem findByShoppingCartItemIdAndShoppingCartItemQuantity(long id, int quantity);
}