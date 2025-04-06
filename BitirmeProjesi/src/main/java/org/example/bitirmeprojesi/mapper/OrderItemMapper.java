package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderItemMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    OrderItem toOrderItem(final ShoppingCartItem shoppingCartItem);
}
