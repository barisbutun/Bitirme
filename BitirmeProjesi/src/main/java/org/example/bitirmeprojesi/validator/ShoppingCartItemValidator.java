package org.example.bitirmeprojesi.validator;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ShoppingCartItemDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.enums.StockState;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.exception.error.InsufficientStockException;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ShoppingCartItemValidator {


    private final ProductRepository productRepository;

    public void validateStockState(final Product product,final int requestedQuantity) {
        if (product.getQuantity() < requestedQuantity) {
            throw new InsufficientStockException(ErrorMesage.INSUFFICIENT_STOCK_ERROR);
        }
    }

}
