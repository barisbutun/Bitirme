package org.example.bitirmeprojesi.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderGetOrderItemsDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.entity.*;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.OrderNotFoundExceiption;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.*;
import org.example.bitirmeprojesi.validator.OrderValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderValidator orderValidator;
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final OrderItemService orderItemService;

    @Transactional
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
            orderItem.setCategory(shoppingCartItem.getProduct().getCategory());
            orderItem.setShoppingCartItem(shoppingCartItem);
            orderItem.setUser(shoppingCartItem.getUser());
            orderItem.setSize(shoppingCartItem.getSize());
            orderItem.setOrder(finalOrders);
            orderItem.setQuantity(shoppingCartItem.getQuantity());
            return orderItemService.create(orderItem);
        }).collect(Collectors.toList());

        orders.setOrderItems(orderItems);

        List<Product> updatedProducts = orderValidator.validateAndUpdateProductStocks(orderItems);
        productRepository.saveAll(updatedProducts);

        if(ordersDto.isSameAddress()){
            orders.setAddress(user.getAddress());
        }

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

    public Page<OrdersDto> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Orders> orders = orderRepository.findAll(pageable);
        Page<OrdersDto> ordersDtos = orders.map(orderMapper::toDto);
        return ordersDtos;
    }

    public void delete(long id) {
        orderRepository.deleteById(id);
    }

    public Page<OrdersDto> findAllByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        Page<Orders> ordersList = orderRepository.findAllByUserId(user.getId(), pageable);
        Page<OrdersDto> ordersDtos = ordersList.map(orderMapper::toDto);

        return ordersDtos;
    }
}
