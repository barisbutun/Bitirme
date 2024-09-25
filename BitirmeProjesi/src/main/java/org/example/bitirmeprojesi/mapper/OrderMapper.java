package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.OrderDto;
import org.example.bitirmeprojesi.entity.Orders;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper {

   // @Mapping(target = "id", ignore = true)
    Orders toEntity(final OrderDto orderDto);

    OrderDto toDto(final Orders orders);

    List<OrderDto> toDtoList(final List<Orders> ordersList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void  update(final OrderDto orderDto, @MappingTarget final Orders orders);
}