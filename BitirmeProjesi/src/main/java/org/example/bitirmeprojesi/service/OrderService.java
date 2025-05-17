package org.example.bitirmeprojesi.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderGetOrderItemsDto;
import org.example.bitirmeprojesi.dto.OrderItemDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.entity.*;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.OrderNotFoundExceiption;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.example.bitirmeprojesi.repository.ShoppingCartItemRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.validator.OrderValidator;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final OrderItemService orderItemService;

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "products_list", allEntries = true)
    })
    public OrdersDto create(OrdersDto ordersDto, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        Orders orders = orderMapper.toEntity(ordersDto);
        orders.setUser(user);


        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(userId);
        orderRepository.save(orders);

      if(shoppingCartItems==null || shoppingCartItems.isEmpty()){
            throw new EntityNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR);
        }


        Orders finalOrders = orders;
        List<OrderItem> orderItems = shoppingCartItems.stream().map(shoppingCartItem -> {
            Product product= shoppingCartItem.getProduct();
            product.setSaleCount(product.getSaleCount()+shoppingCartItem.getQuantity());
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

        List<OrderItemDto> orderItemDtos = orderItems.stream()
                .map(orderItem -> {
                            OrderItemDto orderItemDto = orderMapper.toOrderItemDto(orderItem);
                            orderItemDto.setProductId(orderItem.getProduct().getId());
                            orderItemDto.setOrderId(orderItem.getOrder().getId());
                            orderItemDto.setPrice(orderItem.getProduct().getPrice() * orderItem.getQuantity());
                            return orderItemDto;
                        }
                ).collect(Collectors.toList());

        orders.setOrderItems(orderItems);

        ordersDto.setOrderItems(orderItemDtos);

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
        Page<OrdersDto> ordersDtos = orders.map(order -> {
            OrdersDto ordersDto = orderMapper.toDto(order);
            if (order.getOrderItems() != null) {
                List<OrderItemDto> orderItemDtos = order.getOrderItems().stream()
                        .map(orderItem -> {
                            OrderItemDto orderItemDto = orderMapper.toOrderItemDto(orderItem);
                            orderItemDto.setProductId(orderItem.getProduct().getId());
                            orderItemDto.setOrderId(orderItem.getOrder().getId());
                            orderItemDto.setPrice(orderItem.getProduct().getPrice() * orderItem.getQuantity());
                            return orderItemDto;
                        })
                        .collect(Collectors.toList());
                ordersDto.setOrderItems(orderItemDtos);
            }
            return ordersDto;
        });
        return ordersDtos;
    }

    public void delete(long id) {
        orderRepository.deleteById(id);
    }

    public Page<OrdersDto> findAllByUserId(UUID userId, int page, int size) {

        Sort sort  = Sort.by(Sort.Order.desc("saleDate"));

        Pageable pageable = PageRequest.of(page, size,sort);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        Page<Orders> ordersList = orderRepository.findAllByUserId(user.getId(), pageable);

        return ordersList.map(order -> {
            OrdersDto ordersDto = orderMapper.toDto(order);
            if (order.getOrderItems() != null) {
                List<OrderItemDto> orderItemDtos = order.getOrderItems().stream()
                        .map(orderItem -> {
                            OrderItemDto orderItemDto = orderMapper.toOrderItemDto(orderItem);
                            orderItemDto.setProductId(orderItem.getProduct().getId());
                            orderItemDto.setOrderId(orderItem.getOrder().getId());
                            orderItemDto.setPrice(orderItem.getProduct().getPrice() * orderItem.getQuantity());
                            return orderItemDto;
                        })
                        .collect(Collectors.toList());
                ordersDto.setOrderItems(orderItemDtos);
            }
            return ordersDto;
        });
    }
}
