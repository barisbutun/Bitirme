package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RefundRepository extends JpaRepository<Refund, UUID> {
}
