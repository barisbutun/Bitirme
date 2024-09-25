package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
}
