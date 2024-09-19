package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
