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

    @Mapping(target = "orderItems", expression = "java(order.getOrderItems() != null ? order.getOrderItems().stream().map(this::toOrderItemDto).collect(java.util.stream.Collectors.toList()) : null)")
    OrdersDto toDto(Orders order);

    List<OrdersDto> toDtoList(final List<Orders> ordersList);

    OrderGetOrderItemsDto toDtoOrderGetOrderItems(final Orders orders);

    Orders toEntity(final OrderGetOrderItemsDto ordersDto);

    @Mapping(source = "productId", target = "product.id")
    @Mapping(source = "orderId", target = "order.id")
    OrderItem toOrderItem(final OrderItemDto orderItemDto);

    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "product.id", target = "productId")
    OrderItemDto toOrderItemDto(final OrderItem orderItem);

    List<OrderItemDto> toOrderItemDtoList(final List<OrderItem> orderItems);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(final OrdersDto ordersDto, @MappingTarget final Orders orders);
}