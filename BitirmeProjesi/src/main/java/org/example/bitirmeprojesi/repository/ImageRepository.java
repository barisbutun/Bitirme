package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    Optional<Image> findByName(String name);
    @Query("SELECT i FROM Image i WHERE i.name = :name")
    List<Image> findByNames(@Param("name") String name);

    @Query("SELECT i FROM Image i WHERE i.product.id = :productId")
    List<Image> findByProductId(@Param("productId") Long productId);

}
