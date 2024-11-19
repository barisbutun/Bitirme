package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Favourite;
import org.example.bitirmeprojesi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    Optional<User> findByUserId(UUID userId);
}
