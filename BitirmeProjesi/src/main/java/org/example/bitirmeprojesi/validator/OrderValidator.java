package org.example.bitirmeprojesi.validator;

import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class OrderValidator {
    public void sumPriceCalculating(Orders orders) {
        List<OrderItem> orderItems = orders.getOrderItems();
        double sumPrice = 0;
        for (OrderItem orderItem : orderItems) {
            sumPrice += orderItem.getProduct().getPrice() * orderItem.getQuantity();
        }
        orders.setSumPrice(sumPrice);
    }
}
