package org.example.bitirmeprojesi.validator;

import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.InsufficientStockException;
import org.springframework.stereotype.Component;

import java.util.List;
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
                .collect(Collectors.toList());

        for (Product product : products) {
            int orderedQuantity = orderItems.stream()
                    .filter(orderItem -> orderItem.getProduct().getId().equals(product.getId()))
                    .mapToInt(OrderItem::getQuantity)
                    .sum();
            if (product.getQuantity() < orderedQuantity) {
                throw new InsufficientStockException(ErrorMesage.INSUFFICIENT_STOCK_ERROR);
            }
        }

        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            product.setQuantity(product.getQuantity() - orderItem.getQuantity());
        }
        return products;
    }



}
