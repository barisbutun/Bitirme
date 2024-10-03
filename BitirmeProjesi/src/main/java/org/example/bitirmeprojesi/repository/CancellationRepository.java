package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.Cancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Long> {
}
