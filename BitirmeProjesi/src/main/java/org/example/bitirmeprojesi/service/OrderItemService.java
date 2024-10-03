package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderItemDto;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderMapper orderMapper;
    private final OrderItemRepository orderItemRepository;

    public OrderItemDto create(OrderItemDto orderItemDto) {
        OrderItem orderItem = orderMapper.toOrderItem(orderItemDto);
        orderItemRepository.save(orderItem);
        return orderMapper.toOrderItemDto(orderItem);
    }

}
