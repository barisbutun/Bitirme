package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.entity.Favourite;
import org.example.bitirmeprojesi.entity.User;
import org.mapstruct.*;

import java.util.List;
import java.util.Optional;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FavouriteMapper {


    @Mapping(source = "productId", target = "product.id")
    @Mapping(source = "categoryId", target = "category.id")
    Favourite toEntity(FavouriteDto favouriteDto);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "category.id", target = "categoryId")
    FavouriteDto toDto(Favourite favourite);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Favourite update(FavouriteDto favouriteDto, @MappingTarget Favourite favourite);

    List<FavouriteDto> toDtoList(List<Favourite> favourite);

}
