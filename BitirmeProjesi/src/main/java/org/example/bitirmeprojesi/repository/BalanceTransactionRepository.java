package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.dto.BalanceTransactionResponseDto;
import org.example.bitirmeprojesi.entity.BalanceTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BalanceTransactionRepository extends JpaRepository<BalanceTransaction, UUID> {

    Page<BalanceTransactionResponseDto> findByUserId(UUID userId, Pageable pageable);
}
