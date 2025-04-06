package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.entity.Cancellation;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CancellationMapper {


    CancellationDto toDto(final Cancellation cancellation);

    Cancellation toEntity(final CancellationDto cancellationDto);

    List<CancellationDto> toDtoList(final List<Cancellation> cancellationList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final CancellationDto cancellationDto, @MappingTarget final Cancellation cancellation);


}
