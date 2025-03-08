package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.exception.error.ShoppingCartItemNotFoundException;
import org.example.bitirmeprojesi.mapper.ShoppingCartItemMapper;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.repository.ShoppingCartItemRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.validator.ShoppingCartItemValidator;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final ShoppingCartItemValidator shoppingCartItemValidator;
    private final OrderItemRepository orderItemRepository;

    @Transactional
    public ShoppingCartItemDto create(ShoppingCartItemDto shoppingCartItemDto, UUID userId) {

        User user=userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        Product product=productRepository.findById(shoppingCartItemDto.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

        shoppingCartItemValidator.validateStockState(product,shoppingCartItemDto.getQuantity());
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

    public List<ShoppingCartItemDto> findAllByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR));
        Page<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(user.getId(), pageable);
        return shoppingCartItemMapper.toDtoList( shoppingCartItems.getContent());
    }

    public void delete(UUID userId,Long id) {

        ShoppingCartItem shoppingCartItem =
                shoppingCartItemRepository.findByUserId(userId).
                        stream().filter(shoppingCartItem1 -> shoppingCartItem1.getId() == id).findFirst().orElseThrow(() -> new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR));

        orderItemRepository.detachShoppingCartItem(shoppingCartItem.getId());
        shoppingCartItemRepository.deleteById(shoppingCartItem.getId());
    }
    public ShoppingCartItemDto update(ShoppingCartItemDto shoppingCartItemDto, Long id,UUID userId) {

        ShoppingCartItem shoppingCartItem = shoppingCartItemRepository.findById(id)
                .orElseThrow(() -> new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR));

        shoppingCartItemValidator.validateShoppingState(shoppingCartItemDto, userId);
        shoppingCartItemValidator.validateStockState(shoppingCartItem.getProduct(), shoppingCartItemDto.getQuantity());

        shoppingCartItemMapper.update(shoppingCartItemDto, shoppingCartItem);
        return shoppingCartItemMapper.toDto(shoppingCartItemRepository.save(shoppingCartItem));
    }


    @Transactional
    public void deleteAllByUserId(UUID userId) {

        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(userId);
        shoppingCartItems.forEach(shoppingCartItem ->
                orderItemRepository.detachShoppingCartItem(shoppingCartItem.getId())
        );

        shoppingCartItemRepository.deleteAll(shoppingCartItems);}

}
