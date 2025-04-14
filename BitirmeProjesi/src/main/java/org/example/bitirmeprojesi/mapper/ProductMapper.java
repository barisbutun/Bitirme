package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Product;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = CategoryMapper.class
)
public interface ProductMapper {

    @Mapping(source="category.id", target="categoryId")
    ProductDto toDto(final Product product);

    @Mapping(source="categoryId", target="category.id")
    Product toEntity(final ProductDto productDto);

    List<ProductDto> toDtoList(final List<Product> productList);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final ProductDto productDto, @MappingTarget  final Product product);
}
