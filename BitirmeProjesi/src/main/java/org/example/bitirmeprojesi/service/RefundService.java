package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderItemRefundDto;
import org.example.bitirmeprojesi.dto.RefundDto;
import org.example.bitirmeprojesi.entity.*;
import org.example.bitirmeprojesi.enums.DeliveryStatus;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.RefundStatus;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.*;
import org.example.bitirmeprojesi.mapper.RefundMapper;
import org.example.bitirmeprojesi.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRepository refundRepository;
    private final RefundMapper refundMapper;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    public RefundDto create(RefundDto refundDto, UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        Orders orders = orderRepository.findById(refundDto.getOrderId()).orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        if (!orders.getPaymentState().equals(PaymentState.SUCCESS) ||
                !orders.getPayment().getPaymentState().equals(PaymentState.UPDATED)) {
            throw new PaymentNotCompletedException(ErrorMesage.PAYMENT_NOT_COMPLETED_ERROR);
        }
        Delivery delivery = orders.getDelivery();
        if (delivery != null && delivery.getDeliveryState().equals(DeliveryStatus.PENDING)&&delivery.getDeliveryState().equals(DeliveryStatus.PROCESSING)) {
            throw new DeliveredOrderShouldBeRefundedException(ErrorMesage.DELIVERED_ORDER_SHOULD_BE_REFUNDED_ERROR);
        }


        Refund refund = refundMapper.toEntity(refundDto);
        refund.setStatus(RefundStatus.REQUESTED);
        refundRepository.save(refund);

        return refundMapper.toDto(refund);
    }

    private List<OrderItem> processOrderItems(RefundDto refundDto, User user, Refund refund) {
        double totalRefund = 0;

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRefundDto dto : refundDto.getOrderItems()) {
            OrderItem orderItem = orderItemRepository.findById(dto.getId())
                    .orElseThrow(() -> new OrderItemNotFoundException(ErrorMesage.ORDER_ITEM_NOT_FOUND_ERROR));

            int cancelQty = dto.getRefundQuantity();
            orderItem.setQuantity(orderItem.getQuantity() - cancelQty);

            double refundAmount = cancelQty * orderItem.getProduct().getPrice();
            totalRefund += refundAmount;

            orderItem.setRefund(refund);
            items.add(orderItem);
        }

        user.setBalance(user.getBalance() + totalRefund);
        userRepository.save(user);
        refund.setRefundAmount(totalRefund);

        return items;
    }

    public RefundDto update(RefundDto refundDto,UUID id,UUID userId) {

        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new RefundNotFoundException(ErrorMesage.REFUND_NOT_FOUND_ERROR));

        if (refundDto.getStatus().equals(RefundStatus.APPROVED)) {
            Orders orders = orderRepository.findById(refundDto.getOrderId())
                    .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

            if (!orders.getPaymentState().equals(PaymentState.SUCCESS) ||
                    !orders.getPayment().getPaymentState().equals(PaymentState.UPDATED)) {
                throw new PaymentNotCompletedException(ErrorMesage.PAYMENT_NOT_COMPLETED_ERROR);
            }


            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

            List<OrderItem> orderItems = processOrderItems(refundDto, user, refund);
            updateProductsAndOrderItems(orderItems, refundDto);

        } else {
            refund.setStatus(refundDto.getStatus());
            refundRepository.save(refund);

        }
        return refundMapper.toDto(refund);
    }


    private void updateProductsAndOrderItems(List<OrderItem> orderItems, RefundDto refundDto) {
        orderItems.forEach(orderItem -> {
            Product product = productRepository.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

            int cancelQty = refundDto.getOrderItems().stream()
                    .filter(item -> Objects.equals(item.getId(), orderItem.getId()))
                    .map(OrderItemRefundDto::getRefundQuantity)
                    .findFirst()
                    .orElse(0);

            product.getQuantity().put(
                    orderItem.getSize(),
                    product.getQuantity().getOrDefault(orderItem.getSize(), 0) + cancelQty
            );
            productRepository.save(product);

            if (cancelQty == orderItem.getQuantity()) {
                orderItem.setPaymentState(PaymentState.CANCELLED);
            } else {
                orderItem.setPaymentState(PaymentState.UPDATED);
            }
        });
    }

    public RefundDto findById(UUID id) {
        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new RefundNotFoundException(ErrorMesage.REFUND_NOT_FOUND_ERROR));

        return refundMapper.toDto(refund);
    }


    public void delete(UUID id) {
        Refund refund = refundRepository.findById(id).orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));
        refundRepository.delete(refund);
    }


    public List<RefundDto> findAllByUserId(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        List<Refund> refunds = (List<Refund>) refundRepository.findAllByUserId(user.getId());

        if (refunds.isEmpty()) {
            throw new RefundNotFoundException(ErrorMesage.REFUND_NOT_FOUND_ERROR);
        }

        return refundMapper.toDtoList(refunds);
    }
}
