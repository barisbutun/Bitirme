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
}
