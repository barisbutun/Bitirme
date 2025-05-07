package org.example.bitirmeprojesi.validator;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.enums.DeliveryStatus;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.Size;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.DeliveredOrderShouldBeRefundedException;
import org.example.bitirmeprojesi.exception.error.PaymentNotSuccessfulCancellationException;
import org.example.bitirmeprojesi.repository.*;
import org.springframework.stereotype.Component;

import java.util.Map;

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

   public void validateOrderState(Orders order){
       if(!order.getPaymentState().equals(PaymentState.UPDATED)&&!order.getPaymentState().equals(PaymentState.SUCCESS)){
           throw new PaymentNotSuccessfulCancellationException(ErrorMesage.PAYMENT_NOT_SUCCESSFUL_CANCELLATION_ERROR);
       }
       if(order.getDelivery() != null && order.getDelivery().getDeliveryState().equals(DeliveryStatus.DELIVERED)){
           throw new DeliveredOrderShouldBeRefundedException(ErrorMesage.DELIVERED_ORDER_SHOULD_BE_REFUNDED_ERROR);
       }
   }

    public void cancelledOrderPayment(Orders orders) {
        orders.setPaymentState(PaymentState.CANCELLED);
        orderRepository.save(orders);
    }

    public void validateStockState(Product product,OrderItem orderItem, Integer quantity) {

        Size size=orderItem.getSize();

        Map<Size, Integer> productQuantities = product.getQuantity();

        if (!productQuantities.containsKey(size)) {
            throw new IllegalArgumentException("Product does not have size: " + size);
        }
        int currentStock = productQuantities.get(size);
        if (currentStock < quantity) {
            throw new IllegalArgumentException("Not enough stock for size: " + size);
        }

        productQuantities.put(size, currentStock - quantity);
    }


}
