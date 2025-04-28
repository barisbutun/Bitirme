package org.example.bitirmeprojesi.validator;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.entity.*;
import org.example.bitirmeprojesi.enums.DeliveryStatus;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.DeliveredOrderShouldBeRefundedException;
import org.example.bitirmeprojesi.repository.*;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CancellationValidator {

    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CancellationRepository cancellationRepository;

    public void validateOrderDeliveryState(Orders order) {
        if (order.getDelivery() != null && DeliveryStatus.DELIVERED.equals(order.getDelivery().getDeliveryState())) {
            throw new DeliveredOrderShouldBeRefundedException(ErrorMesage.DELIVERED_ORDER_SHOULD_BE_REFUNDED_ERROR);
        }
    }

    public void updateOrderItemQuantity(OrderItem orderItem, Integer quantity) {
        orderItem.setQuantity(orderItem.getQuantity() - quantity);
        orderItemRepository.save(orderItem);
    }

    public void updateUserBalance(User user, OrderItem orderItem, Integer quantity) {
        user.setBalance(user.getBalance() + quantity * orderItem.getProduct().getPrice());
        userRepository.save(user);
    }
    public void amountCancelPrice(Cancellation cancellation, OrderItem orderItem, Integer quantity) {
        cancellation.setCancelAmount(quantity * orderItem.getProduct().getPrice());
        cancellationRepository.save(cancellation);
    }

    public void cancelledOrderPayment(Orders orders) {
        orders.setPaymentState(PaymentState.CANCELLED);
        orderRepository.save(orders);
    }

    public void updateOrderItemPayment(OrderItem orderItem,Orders orders, CancellationDto cancellationDto) {

        if (orderItem.getQuantity().equals(cancellationDto.getQuantity())) {

            orderItem.setPaymentState(PaymentState.CANCELLED);
        } else {
            orderItem.setPaymentState(PaymentState.UPDATED);
            orderItemRepository.save(orderItem);
        }
        orders.setPaymentState(PaymentState.UPDATED);
        orderRepository.save(orders);

    }

    public void validateStockState(Product product, Integer quantity) {
        product.setQuantity(product.getQuantity() + quantity);

    }


}
