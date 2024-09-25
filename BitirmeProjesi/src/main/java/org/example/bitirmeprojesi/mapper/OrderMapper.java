package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.entity.Orders;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper {

   // @Mapping(target = "id", ignore = true)
    Orders toEntity(final OrdersDto ordersDto);

    OrdersDto toDto(final Orders orders);

    List<OrdersDto> toDtoList(final List<Orders> ordersList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void  update(final OrdersDto ordersDto, @MappingTarget final Orders orders);
}