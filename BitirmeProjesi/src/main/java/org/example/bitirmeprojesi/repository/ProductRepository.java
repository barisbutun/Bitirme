package org.example.bitirmeprojesi.repository;


import org.example.bitirmeprojesi.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product,Long> {

    void findByName(String name);
}
