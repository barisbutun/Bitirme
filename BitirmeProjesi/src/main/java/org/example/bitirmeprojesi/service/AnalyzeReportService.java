package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.AnalyzeReportDto;
import org.example.bitirmeprojesi.entity.AnalyzeReport;
import org.example.bitirmeprojesi.mapper.AnalyzeReportMapper;
import org.example.bitirmeprojesi.repository.AnalyzeReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyzeReportService {

    private final AnalyzeReportRepository analyzeReportRepository;
    private final AnalyzeReportMapper analyzeReportMapper;

    public AnalyzeReportDto create(AnalyzeReportDto analyzeReportDto) {
        AnalyzeReport analyzeReport = analyzeReportMapper.toEntity(analyzeReportDto);
        analyzeReportRepository.save(analyzeReport);
        return analyzeReportMapper.toDto(analyzeReport);
    }

    public AnalyzeReportDto findById(long id) {
        return analyzeReportMapper.toDto(analyzeReportRepository.findById(id).get());
    }

    public List<AnalyzeReportDto> findAll() {
        return analyzeReportMapper.toDtoList(analyzeReportRepository.findAll());
    }

    public AnalyzeReportDto update(AnalyzeReportDto analyzeReportDto, long id) {
        analyzeReportRepository.findById(id).orElseThrow(() -> new RuntimeException("AnalyzeReport not found()->"));
        AnalyzeReport analyzeReport = analyzeReportMapper.toEntity(analyzeReportDto);
        analyzeReportRepository.save(analyzeReport);
        return analyzeReportMapper.toDto(analyzeReport);
    }

    public void delete(long id) {
        analyzeReportRepository.deleteById(id);
    }

}
