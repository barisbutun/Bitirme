package org.example.bitirmeprojesi.mapper;


import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ShoppingCartItemMapper {


    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.price", target = "price")
    @Mapping(source = "product.name", target = "name")
    ShoppingCartItemDto toDto(final ShoppingCartItem shoppingCartItem);

    @Mapping(source = "productId", target = "product.id")
    @Mapping(source = "price", target = "product.price")
    @Mapping(source = "name", target = "product.name")
    ShoppingCartItem toEntity(final ShoppingCartItemDto shoppingCartItemDto);


    List<ShoppingCartItemDto> toDtoList(final List<ShoppingCartItem> shoppingCartItems);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(ShoppingCartItemDto shoppingCartItemDto, @MappingTarget ShoppingCartItem shoppingCartItem);
}
