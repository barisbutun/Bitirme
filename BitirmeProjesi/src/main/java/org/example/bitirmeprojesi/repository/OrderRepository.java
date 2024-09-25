package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Orders, Long> {
}
