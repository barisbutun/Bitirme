package org.example.bitirmeprojesi.validator;

import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.enums.Size;
import org.example.bitirmeprojesi.enums.StockState;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.InvalidProductInformationException;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ProductValidator {

    public void checkStockState(ProductDto productDto, Product product) {

        Map<Size, Integer> quantity = product.getQuantity();

        for (Map.Entry<Size, Integer> entry : quantity.entrySet()) {
            if (entry.getKey() == null || entry.getValue() == null || entry.getValue() <= 0) {
                throw new InvalidProductInformationException(ErrorMesage.INVALID_PRODUCT_INFORMATION_ERROR);
            }
        }

        productDto.setStockState(StockState.AVAILABLE);
        product.setStockState(StockState.AVAILABLE);
    }
}

