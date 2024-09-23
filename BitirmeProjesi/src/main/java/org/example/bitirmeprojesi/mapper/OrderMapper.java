package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.OrderDto;
import org.example.bitirmeprojesi.entity.Order;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper {

   // @Mapping(target = "id", ignore = true)
    Order toEntity(final OrderDto orderDto);

    OrderDto toDto(final Order order);

    List<OrderDto> toDtoList(final List<Order> orderList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void  update(final OrderDto orderDto, @MappingTarget final Order order);
}