package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.entity.Favourite;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FavouriteMapper {


    @Mapping(source = "productId", target = "product.id")
    @Mapping(source = "categoryId", target = "category.id")
    @Mapping(source = "price", target = "product.price")
    @Mapping(source = "name", target = "product.name")
    Favourite toEntity(final FavouriteDto favouriteDto);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "product.price", target = "price")
    @Mapping(source = "product.name", target = "name")
    FavouriteDto toDto(final Favourite favourite);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Favourite update(final FavouriteDto favouriteDto, @MappingTarget final  Favourite favourite);

    List<FavouriteDto> toDtoList(final List<Favourite> favourite);

}
