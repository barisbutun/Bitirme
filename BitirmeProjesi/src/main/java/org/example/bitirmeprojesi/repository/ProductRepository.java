package org.example.bitirmeprojesi.repository;

import jakarta.persistence.EntityManager;
import org.example.bitirmeprojesi.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product,Long> {

    void findByName(String name);
}
