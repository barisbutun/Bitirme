package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderGetOrderItemsDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.example.bitirmeprojesi.mapper.OrderItemMapper;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.example.bitirmeprojesi.repository.ShoppingCartItemRepository;
import org.example.bitirmeprojesi.validator.OrderValidator;
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
    private final TokenService tokenService;

    @Transactional
    public OrdersDto create(String userId, OrdersDto ordersDto) {
        UUID uuidUserId = UUID.fromString(userId);
        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(uuidUserId);

        if (shoppingCartItems.isEmpty()) {
            throw new NoSuchElementException("Sepetinizde ürün bulunmamaktadır!");
        }

        Orders orders = orderMapper.toEntity(ordersDto);
        orders = orderRepository.save(orders);  // İlk kaydetme, ID oluşturma

        Orders finalOrders = orders;

        List<OrderItem> orderItems = shoppingCartItems.stream()
                .map(shoppingCartItem -> {
                    OrderItem orderItem = orderItemMapper.toOrderItem(shoppingCartItem);
                    orderItem.setOrder(finalOrders);
                    return orderItem;
                })
                .collect(Collectors.toList());

        // Ürün isimlerini virgülle birleştirerek Orders name alanına ekliyoruz.
        String productNames = orderItems.stream()
                .map(orderItem -> orderItem.getProduct().getName())
                .collect(Collectors.joining(", "));

        finalOrders.setName(productNames);
        orderValidator.sumPriceCalculating(orders);
        orderRepository.save(finalOrders);  // Name alanı güncelleniyor.

        orderItemRepository.saveAll(orderItems);

        shoppingCartItemRepository.deleteAllByUserId(uuidUserId);

        return orderMapper.toDto(orders);
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

 /* UUID uuidUserId = UUID.fromString(userId);
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

        return orderMapper.toDto(savedOrder);*/

       /* UUID uuidUserId = UUID.fromString(userId);
        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(uuidUserId);
        if (shoppingCartItems.isEmpty()) {
            throw new RuntimeException("Sepetinizde ürün bulunmamaktadır!");
        }
        Orders orders = orderMapper.toEntity(ordersDto);
        for(ShoppingCartItem shoppingCartItem : shoppingCartItems){
            OrderItem orderItem = new OrderItem();
            orderItemMapper.toOrderItem(shoppingCartItem);
        }
        orderRepository.save(orders);
        orderItemRepository.saveAll(shoppingCartItems);
        return orderMapper.toDto(orders);*/
      /*  UUID uuidUserId = UUID.fromString(userId);
        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(uuidUserId);
        if (shoppingCartItems.isEmpty()) {
            throw new RuntimeException("Sepetinizde ürün bulunmamaktadır!");
        }

        Orders orders = orderMapper.toEntity(ordersDto);
        orders = orderRepository.save(orders); // Önce siparişi kaydediyoruz.

        Orders finalOrders = orders;
        List<OrderItem> orderItems = shoppingCartItems.stream()
                .map(shoppingCartItem -> {
                    OrderItem orderItem = orderItemMapper.toOrderItem(shoppingCartItem);
                    orderItem.setOrder(finalOrders); // Her OrderItem'a siparişi ekliyoruz.
                    return orderItem;
                })
                .collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems); // OrderItem'ları kaydediyoruz.

        shoppingCartItemRepository.deleteAllByUserId(uuidUserId); // Sepeti temizliyoruz.

        return orderMapper.toDto(orders); // DTO'yu döndürüyoruz.*/
