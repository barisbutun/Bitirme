package org.example.bitirmeprojesi.mapper;


import org.example.bitirmeprojesi.dto.RefundDto;
import org.example.bitirmeprojesi.entity.Refund;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RefundMapper {

    RefundDto toDto(final Refund refund);

    Refund toEntity(final RefundDto refundDto);

    List<RefundDto> toDtoList(final List<Refund> refundList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final RefundDto refundDto, @MappingTarget final Refund refund);
}
