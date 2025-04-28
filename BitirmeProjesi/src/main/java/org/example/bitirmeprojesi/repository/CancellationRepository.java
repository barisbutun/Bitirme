package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.entity.Cancellation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Long> {

    Page<Cancellation> findAllByUserId(UUID userId, Pageable pageable);

    @Query("SELECT c FROM Cancellation c WHERE c.order.id = :orderId")
    Optional<Cancellation> findByOrderId(@Param("orderId") Long orderId);



}
