package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Orders, Long> {
    @Query("SELECT o FROM Orders o WHERE o.user.id = :userId")
    Page<Orders> findAllByUserId(@Param("userId") UUID userId, Pageable pageable);

}
