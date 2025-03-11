package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderItemDto;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.UserIdNotFoundException;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderMapper orderMapper;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;


    public OrderItem create(OrderItem orderItem) {
        // ShoppingCartItem ID ve quantity kombinasyonuyla mevcut bir OrderItem var mı kontrol et
        OrderItem existingOrderItem = orderItemRepository.findByShoppingCartItemIdAndShoppingCartItemQuantity(
                orderItem.getShoppingCartItem().getId(), orderItem.getShoppingCartItem().getQuantity());

        // Eğer varsa, yeni bir kayıt ekleme, mevcut kaydı döndür
        if (existingOrderItem != null) {
            return existingOrderItem;
        }

        // Eğer yoksa, yeni OrderItem oluştur ve kaydet
        return orderItemRepository.save(orderItem);
    }

    public List<OrderItemDto> findByOrderId(UUID userId,Long orderId) {

        userId = JwtUtil.getUserIdFromToken();
        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(ErrorMesage.USER_ID_NOT_FOUND_ERROR));
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        return orderMapper.toOrderItemDtoList(orderItems);

    }







}
