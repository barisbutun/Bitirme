package org.example.bitirmeprojesi.validator;

import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.enums.Size;
import org.example.bitirmeprojesi.enums.StockState;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.InsufficientStockException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class OrderValidator {
    public void sumPriceCalculating(Orders orders) {
        List<OrderItem> orderItems = orders.getOrderItems();
        double sumPrice = 0;
        for (OrderItem orderItem : orderItems) {
            sumPrice += orderItem.getProduct().getPrice() * orderItem.getShoppingCartItem().getQuantity();
        }
        orders.setSumPrice(sumPrice);
    }

    public List<Product> validateAndUpdateProductStocks(List<OrderItem> orderItems) {
        List<Product> products = orderItems.stream()
                .map(OrderItem::getProduct)
                .distinct()
                .toList();

        for (Product product : products) {
            Map<Size, Integer> productQuantities = product.getQuantity();

            if(product.getStockState().equals(StockState.UNAVAILABLE)){
                throw new InsufficientStockException(ErrorMesage.INSUFFICIENT_STOCK_ERROR);
            }

            Map<Size, Integer> orderedQuantitiesPerSize = orderItems.stream()
                    .filter(orderItem -> orderItem.getProduct().getId().equals(product.getId()))
                    .collect(Collectors.groupingBy(
                            OrderItem::getSize,
                            Collectors.summingInt(OrderItem::getQuantity)
                    ));

            for (Map.Entry<Size, Integer> entry : orderedQuantitiesPerSize.entrySet()) {
                Size orderedSize = entry.getKey();
                int orderedQuantity = entry.getValue();

                if (!productQuantities.containsKey(orderedSize)) {
                    throw new IllegalArgumentException("Product does not have size: " + orderedSize);
                }

                int currentStock = productQuantities.get(orderedSize);
                if (currentStock < orderedQuantity) {
                    throw new InsufficientStockException(ErrorMesage.INSUFFICIENT_STOCK_ERROR);
                }

                productQuantities.put(orderedSize, currentStock - orderedQuantity);
            }
        }

        return products;
    }




}
