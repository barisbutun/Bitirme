package org.example.bitirmeprojesi.mapper;

import org.example.bitirmeprojesi.dto.OrderGetOrderItemsDto;
import org.example.bitirmeprojesi.dto.OrderItemDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper {
    Orders toEntity(final OrdersDto ordersDto);

    OrdersDto toDto(final Orders orders);

    List<OrdersDto> toDtoList(final List<Orders> ordersList);

    OrderGetOrderItemsDto toDtoOrderGetOrderItems(final Orders orders);

    Orders toEntity(OrderGetOrderItemsDto ordersDto);

    OrderItem toOrderItem(final OrderItemDto orderItemDto);

    OrderItemDto toOrderItemDto(OrderItem orderItem);

    List<OrderItemDto> toOrderItemDtoList(List<OrderItem> orderItems);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final OrdersDto ordersDto, @MappingTarget final Orders orders);
}