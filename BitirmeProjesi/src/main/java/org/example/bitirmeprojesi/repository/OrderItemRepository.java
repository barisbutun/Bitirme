package org.example.bitirmeprojesi.repository;

import jakarta.persistence.criteria.From;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
  @Query("SELECT o FROM OrderItem o WHERE o.order.user.id = :userId")
  List<OrderItem> findByUserId(@Param("userId") UUID userId);

  void saveAll(List<ShoppingCartItem> shoppingCartItems);
}
