package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.entity.Favourite;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FavouriteMapper {

    Favourite toEntity(FavouriteDto favouriteDto);

    FavouriteDto toDto(Favourite favourite);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Favourite update(FavouriteDto favouriteDto, @MappingTarget Favourite favourite);

    List<FavouriteDto> toDtoList(List<Favourite> favourite);

}
