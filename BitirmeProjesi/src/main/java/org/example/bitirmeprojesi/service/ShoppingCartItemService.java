package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.ShoppingCartItemNotFoundException;
import org.example.bitirmeprojesi.mapper.ShoppingCartItemMapper;
import org.example.bitirmeprojesi.repository.ShoppingCartItemRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShoppingCartItemService {

    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ShoppingCartItemMapper shoppingCartItemMapper;
    private final UserRepository userRepository;

    public ShoppingCartItemDto create(ShoppingCartItemDto shoppingCartItemDto) {
        ShoppingCartItem shoppingCartItem = shoppingCartItemMapper.toEntity(shoppingCartItemDto);
        shoppingCartItem = shoppingCartItemRepository.save(shoppingCartItem);
        return shoppingCartItemMapper.toDto(shoppingCartItem);
    }
    public ShoppingCartItemDto findById(long id) {
        ShoppingCartItem shoppingCartItem = shoppingCartItemRepository.findById(id).orElseThrow(() -> new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR));
        return shoppingCartItemMapper.toDto(shoppingCartItem);
    }

    public List<ShoppingCartItemDto> findAllByUserId(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR));
        List<ShoppingCartItem> shoppingCartItems = user.getShoppingCartItems();
        return shoppingCartItemMapper.toDtoList(shoppingCartItems);
    }

    public void delete(long id) {
        shoppingCartItemRepository.deleteById(id);
    }

    public void deleteAllByUserId(UUID userId) {
        shoppingCartItemRepository.deleteAllByUserId(userId);
    }


}
