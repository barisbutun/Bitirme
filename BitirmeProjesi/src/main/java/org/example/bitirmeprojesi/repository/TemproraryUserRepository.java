package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.TemproraryUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TemproraryUserRepository extends JpaRepository<TemproraryUser, Long> {

    void deleteByCodeGeneratedAtBefore(LocalDateTime expirationTime);

    TemproraryUser findByEmailAndCode(String email, String code);
}

