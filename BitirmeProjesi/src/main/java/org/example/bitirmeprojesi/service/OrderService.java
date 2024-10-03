package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderGetOrderItemsDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.example.bitirmeprojesi.validator.OrderValidator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderValidator orderValidator;
    private final OrderItemRepository orderItemRepository;


    public OrdersDto create(String userId, OrdersDto ordersDto) {
        UUID uuidUserId = UUID.fromString(userId);
        List<OrderItem> orderItems = orderItemRepository.findByUserId(uuidUserId);
        if (orderItems.isEmpty()) {
            throw new RuntimeException("Sepetinizde ürün bulunmamaktadır!");
        }

        Orders orders = orderMapper.toEntity(ordersDto);

        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(orders);
        }
        orderValidator.sumPriceCalculating(orders);

        orders.setOrderItems(orderItems);
        Orders savedOrder = orderRepository.save(orders);

        return orderMapper.toDto(savedOrder);
    }


    public OrdersDto findById(Long id) {
        Orders orders = orderRepository.findById(id).get();
        return orderMapper.toDto(orders);
    }

    public OrderGetOrderItemsDto getOrderItemsById(Long id) {
        Orders orders = orderRepository.findById(id).isPresent() ? orderRepository.findById(id).get() : null;
        return orderMapper.toDtoOrderGetOrderItems(orders);
    }

    public List<OrdersDto> findAll() {
        List<Orders> ordersList = orderRepository.findAll();
        return orderMapper.toDtoList(ordersList);
    }

    public OrdersDto update(OrdersDto ordersDto, long id) {
        Orders orders = orderRepository.findById(id).get();
        orderMapper.update(ordersDto, orders);
        orderRepository.save(orders);
        return orderMapper.toDto(orders);
    }

    public void delete(long id) {
        orderRepository.deleteById(id);

    }

}
