package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Orders, Long> {
    @Query("SELECT o FROM Orders o WHERE o.user.id = :userId")
    List<Orders> findAllByUserId(@Param("userId") UUID userId);

}
