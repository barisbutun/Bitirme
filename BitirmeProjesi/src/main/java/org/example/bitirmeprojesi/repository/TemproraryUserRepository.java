package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.TemporaryUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TemproraryUserRepository extends JpaRepository<TemporaryUser, Long> {

    void deleteByCodeGeneratedAtBefore(LocalDateTime expirationTime);

    TemporaryUser findByEmailAndCode(String email, String code);

    TemporaryUser findByEmail(String email);

    boolean existsByEmail(String email);

    TemporaryUser findByCode(String code);
}

