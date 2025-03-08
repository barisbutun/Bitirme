package org.example.bitirmeprojesi.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderGetOrderItemsDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.OrderNotFoundExceiption;
import org.example.bitirmeprojesi.mapper.OrderItemMapper;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.example.bitirmeprojesi.repository.ShoppingCartItemRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.validator.OrderValidator;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderValidator orderValidator;
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final OrderItemMapper orderItemMapper;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final OrderItemService orderItemService;

    public OrdersDto create(OrdersDto ordersDto, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        Orders orders = orderMapper.toEntity(ordersDto);
        orders.setUser(user);

        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(userId);
        orderRepository.save(orders);

        Orders finalOrders = orders;
        List<OrderItem> orderItems = shoppingCartItems.stream().map(shoppingCartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(shoppingCartItem.getProduct());
            orderItem.setShoppingCartItem(shoppingCartItem);
            orderItem.setUser(shoppingCartItem.getUser());
            orderItem.setOrder(finalOrders);
            orderItem.setQuantity(shoppingCartItem.getQuantity());
            return orderItemService.create(orderItem);
        }).collect(Collectors.toList());

        orders.setOrderItems(orderItems);

        String productNames = orderItems.stream()
                .map(orderItem -> orderItem.getProduct().getName())
                .collect(Collectors.joining(", "));

        orderValidator.sumPriceCalculating(orders);
        finalOrders.setName(productNames);
        orderItemRepository.saveAll(orderItems);

        return orderMapper.toDto(orders);
    }

    public OrdersDto findById(Long id) {
        Orders orders = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));
        return orderMapper.toDto(orders);
    }

    public OrderGetOrderItemsDto getOrderItemsById(Long id) {
        Orders orders = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));
        return orderMapper.toDtoOrderGetOrderItems(orders);
    }

    public OrdersDto update(OrdersDto ordersDto, long id) {
        Orders orders = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));
        orderMapper.update(ordersDto, orders);
        orderRepository.save(orders);
        return orderMapper.toDto(orders);
    }

    public List<OrdersDto> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Orders> orders = orderRepository.findAll(pageable);
        return orderMapper.toDtoList(orders.getContent());
    }

    public void delete(long id) {
        orderRepository.deleteById(id);
    }

    public List<OrdersDto> findAllByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Page<Orders> ordersList = orderRepository.findAllByUserId(user.getId(), pageable);
        return orderMapper.toDtoList(ordersList.getContent());
    }
}
