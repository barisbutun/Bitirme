package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.AnalyzeReportDto;
import org.example.bitirmeprojesi.entity.AnalyzeReport;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AnalyzeReportMapper {


    AnalyzeReportDto toDto(final AnalyzeReport analyzeReport);

    AnalyzeReport toEntity(final AnalyzeReportDto analyzeReportDto);

    List<AnalyzeReportDto> toDtoList(final List<AnalyzeReport> AnalyzeReportList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final AnalyzeReportDto analyzeReportDto, @MappingTarget final AnalyzeReport analyzeReport);

}
