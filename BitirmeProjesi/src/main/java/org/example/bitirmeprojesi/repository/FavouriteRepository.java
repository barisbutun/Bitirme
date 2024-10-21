package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
}
