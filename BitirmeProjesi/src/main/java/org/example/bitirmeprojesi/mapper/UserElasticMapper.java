package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.dto.UserElasticDto;
import org.example.bitirmeprojesi.entity.ProductElastic;
import org.example.bitirmeprojesi.entity.UserElastic;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserElasticMapper {

    UserElasticDto toDto(final UserElastic userElastic);

    List<UserElasticDto> toDtoList(final List<UserElastic> userElasticList);

}
