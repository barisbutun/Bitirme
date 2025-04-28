package org.example.bitirmeprojesi.repository;


import jakarta.persistence.LockModeType;
import org.example.bitirmeprojesi.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    void findByName(String name);


    @Query("SELECT p FROM Product p WHERE " +
            "( :category IS NULL OR p.category.name = :category ) AND " +
            "( :name IS NULL OR p.name = :name ) AND " +
            "( :minPrice IS NULL OR p.price >= :minPrice ) AND " +
            "( :maxPrice IS NULL OR p.price <= :maxPrice ) " +
            "ORDER BY p.price ASC")
    List<Product> findByFilters(@Param("name") String name,
                                @Param("category") String category,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice);

    @Query("SELECT p.category.id FROM Product p WHERE p.id = :productId")
    Long findCategoryIdByProductId(Long productId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :productId")
    Optional<Product> findByIdForUpdate(@Param("productId") Long productId);



    @Query("SELECT p FROM Product p ORDER BY p.averageRating DESC")
    Page<Product> findAllOrderByAverageRatingDesc(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.averageRating > 0 ORDER BY p.averageRating DESC")
    Page<Product> findAllRatedProducts(Pageable pageable);

}
