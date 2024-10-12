package org.example.bitirmeprojesi.mapper;


import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ShoppingCartItemMapper {


    ShoppingCartItemDto toDto(final ShoppingCartItem shoppingCartItem);

    ShoppingCartItem toEntity(final ShoppingCartItemDto shoppingCartItemDto);

    List<ShoppingCartItemDto> toDtoList(final List<ShoppingCartItem> shoppingCartItems);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(ShoppingCartItemDto shoppingCartItemDto, @MappingTarget ShoppingCartItem shoppingCartItem);
}
