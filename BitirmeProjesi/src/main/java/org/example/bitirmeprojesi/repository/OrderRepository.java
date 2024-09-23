package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
