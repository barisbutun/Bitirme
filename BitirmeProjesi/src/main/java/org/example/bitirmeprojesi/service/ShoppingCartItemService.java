package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.example.bitirmeprojesi.mapper.ShoppingCartItemMapper;
import org.example.bitirmeprojesi.repository.ShoppingCartItemRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShoppingCartItemService {

    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ShoppingCartItemMapper shoppingCartItemMapper;

    public ShoppingCartItemDto create(ShoppingCartItemDto shoppingCartItemDto) {
        ShoppingCartItem shoppingCartItem = shoppingCartItemMapper.toEntity(shoppingCartItemDto);
        shoppingCartItem = shoppingCartItemRepository.save(shoppingCartItem);
        return shoppingCartItemMapper.toDto(shoppingCartItem);
    }

    public void delete(long id) {
        shoppingCartItemRepository.deleteById(id);
    }

    public void deleteAllByUserId(UUID userId) {
        shoppingCartItemRepository.deleteAllByUserId(userId);
    }


}
