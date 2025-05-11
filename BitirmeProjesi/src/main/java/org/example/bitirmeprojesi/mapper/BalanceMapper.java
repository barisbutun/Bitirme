package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.BalanceTransactionResponseDto;
import org.example.bitirmeprojesi.entity.BalanceTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface BalanceMapper {

    BalanceTransactionResponseDto toDto( final BalanceTransaction balanceTransaction);

}
