package org.example.bitirmeprojesi.repository;


import org.example.bitirmeprojesi.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    void findByName(String name);


    @Query("SELECT p FROM Product p WHERE " +
            "( :category IS NULL OR p.category = :category ) AND " +
            "( :name IS NULL OR p.name = :name ) AND " +
            "( :minPrice IS NULL OR p.price >= :minPrice ) AND " +
            "( :maxPrice IS NULL OR p.price <= :maxPrice )")
    List<Product> findByFilters(@Param("name") String name,
                                @Param("category") String category,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice);

    @Query("SELECT p.category.id FROM Product p WHERE p.id = :productId")
    Long findCategoryIdByProductId(Long productId);



}
