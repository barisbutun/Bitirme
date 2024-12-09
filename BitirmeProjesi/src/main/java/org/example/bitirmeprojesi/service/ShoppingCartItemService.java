package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.ShoppingCartItemNotFoundException;
import org.example.bitirmeprojesi.mapper.ShoppingCartItemMapper;
import org.example.bitirmeprojesi.repository.ProductRepository;
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
    private final ProductRepository productRepository;

    public ShoppingCartItemDto create(ShoppingCartItemDto shoppingCartItemDto, UUID userId) {

        User user=userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        Product product=productRepository.findById(shoppingCartItemDto.getProductId())
                .orElseThrow(() -> new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR));

        ShoppingCartItem shoppingCartItem = shoppingCartItemMapper.toEntity(shoppingCartItemDto);
        shoppingCartItem.setUser(user);
        shoppingCartItem.setProduct(product);
        ShoppingCartItem savedShoppingCartItem = shoppingCartItemRepository.save(shoppingCartItem);
        return shoppingCartItemMapper.toDto(savedShoppingCartItem);

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
