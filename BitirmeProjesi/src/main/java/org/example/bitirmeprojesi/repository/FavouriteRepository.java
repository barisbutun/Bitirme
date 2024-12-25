package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    List<Favourite> findByUserId(UUID userId);
}
