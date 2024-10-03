package org.example.bitirmeprojesi.validator;

import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.enums.StockState;
import org.springframework.stereotype.Component;

@Component
public class ProductValidator {

    public StockState checkStockState(final OrderItem orderItem) {

        if (orderItem.getQuantity() == 0) {
            return StockState.UNAVAILABLE;
        } else {
            return StockState.AVAILABLE;
        }
    }

}
