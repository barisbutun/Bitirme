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
        // Kullanıcıyı kontrol et ve getir
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        // Ürünü kontrol et ve getir
        Product product = productRepository.findById(shoppingCartItemDto.getProductId())
                .orElseThrow(() -> new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR));

        // ShoppingCartItem nesnesini oluştur ve değerlerini ata
        ShoppingCartItem shoppingCartItem = new ShoppingCartItem();
        shoppingCartItem.setQuantity(shoppingCartItemDto.getQuantity());
        shoppingCartItem.setProduct(product);
        shoppingCartItem.setUser(user);

        // Veritabanına kaydet
        shoppingCartItem = shoppingCartItemRepository.save(shoppingCartItem);

        // Kaydedilen nesneyi DTO'ya dönüştür ve döndür
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
