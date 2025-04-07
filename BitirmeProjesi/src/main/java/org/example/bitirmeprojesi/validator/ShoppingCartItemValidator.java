package org.example.bitirmeprojesi.validator;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.ShoppingCartItem;
import org.example.bitirmeprojesi.enums.StockState;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.exception.error.InsufficientStockException;
import org.example.bitirmeprojesi.exception.error.ShoppingCartItemNotFoundException;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.repository.ShoppingCartItemRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ShoppingCartItemValidator {


    private final ShoppingCartItemRepository shoppingCartItemRepository;

    public void validateStockState(final Product product, final int requestedQuantity) {
        if (product.getQuantity() < requestedQuantity) {
            throw new InsufficientStockException(ErrorMesage.INSUFFICIENT_STOCK_ERROR);
        }
    }

    public void validateShoppingState(ShoppingCartItemDto shoppingCartItemDto, UUID userId,Long id) {

        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(userId);

        // Eğer alışveriş sepeti boşsa, hata fırla
        if (shoppingCartItems.isEmpty()) {
            throw new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR);
        }

        boolean exists = shoppingCartItems.stream()
                .anyMatch(item -> item.getId() == id);

        if (!exists) {
            throw new ShoppingCartItemNotFoundException(ErrorMesage.SHOPPING_CART_ITEM_NOT_FOUND_ERROR);
        }

    }
}