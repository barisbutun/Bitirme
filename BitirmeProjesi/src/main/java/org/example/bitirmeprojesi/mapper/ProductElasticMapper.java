package org.example.bitirmeprojesi.mapper;


import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.ProductElastic;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = CategoryMapper.class
)
public interface ProductElasticMapper {

    ProductDto toDto(final ProductElastic productElastic);

    List<ProductDto> toDtoList(final List<ProductElastic> productList);

}
