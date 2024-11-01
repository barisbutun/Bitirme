package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    Optional<Image> findByName(String name);
}
