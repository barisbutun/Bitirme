package org.example.bitirmeprojesi.repository;

import org.example.bitirmeprojesi.entity.AnalyzeReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalyzeReportRepository extends JpaRepository<AnalyzeReport, Long> {

}
