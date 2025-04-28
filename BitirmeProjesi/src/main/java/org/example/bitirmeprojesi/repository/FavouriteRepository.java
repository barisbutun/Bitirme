package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Favourite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    Page<Favourite> findByUserId(UUID userId, Pageable pageable);

    List<Favourite> findByUserId(UUID userId);

    @Query("select count(f) from Favourite f where f.user.id = :userId")
    Integer countByUserId(@Param("userId") UUID userId);

    List<Favourite> findByProductId(Long productId);
}
