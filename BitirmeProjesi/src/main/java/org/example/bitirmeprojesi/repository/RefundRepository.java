package org.example.bitirmeprojesi.repository;


import org.example.bitirmeprojesi.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface RefundRepository extends JpaRepository<Refund, UUID> {

    @Query("SELECT r FROM Refund r WHERE r.user.id = :userId")
    Refund findAllByUserId(UUID userId);

}
