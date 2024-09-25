package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Product;
import org.mapstruct.*;

import java.util.List;
@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {

    ProductDto toDto(final Product product);

    Product toEntity(final ProductDto productDto);

    List<ProductDto> toDtoList(final List<Product> productList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(ProductDto productDto, @MappingTarget Product product);




}
