package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.dto.OrderItemCancellationDto;
import org.example.bitirmeprojesi.entity.*;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.enums.Size;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.*;
import org.example.bitirmeprojesi.mapper.CancellationMapper;
import org.example.bitirmeprojesi.repository.*;
import org.example.bitirmeprojesi.validator.CancellationValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class CancellationService {

    private final CancellationRepository cancellationRepository;
    private final CancellationMapper cancellationMapper;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CancellationValidator cancellationValidator;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemCancellationRepository orderItemCancellationRepository;

    @Transactional
    public CancellationDto create(CancellationDto cancellationDto, UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        Orders order = orderRepository.findById(cancellationDto.getOrderId())
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        cancellationValidator.validateOrderState(order);

        Cancellation cancellation = cancellationMapper.toEntity(cancellationDto);
        cancellation.setOrder(order);
        cancellation.setUser(user);
        cancellationRepository.save(cancellation);
        List<OrderItemCancellation> itemCancellations = processOrderItemCancellations(cancellationDto, user, cancellation);
        cancellation.setOrderItemCancellations(itemCancellations);

        updateProductsAndItems(itemCancellations);


        order.setCancellations(cancellation);

        orderRepository.save(order);

        return cancellationMapper.toDto(cancellation);
    }


    private List<OrderItemCancellation> processOrderItemCancellations(CancellationDto dto, User user, Cancellation cancellation) {
        double totalRefund = 0;
        List<OrderItemCancellation> cancellations = new ArrayList<>();

        for (OrderItemCancellationDto itemDto : dto.getOrderItems()) {
            OrderItem orderItem = orderItemRepository.findById(itemDto.getId())
                    .orElseThrow(() -> new OrderItemNotFoundException(ErrorMesage.ORDER_ITEM_NOT_FOUND_ERROR));

            int cancelQty = itemDto.getCancelQuantity();
            if (cancelQty <= 0 || cancelQty > orderItem.getQuantity()) {
                throw new CancelQuantityException(ErrorMesage.CANCEL_QUANTITY_ERROR);
            }

            // OrderItem güncellemesi
            orderItem.setQuantity(orderItem.getQuantity() - cancelQty);
            if (orderItem.getQuantity() == 0) {
                orderItem.setPaymentState(PaymentState.CANCELLED);
            } else {
                orderItem.setPaymentState(PaymentState.UPDATED);
            }


            double refundAmount = cancelQty * orderItem.getProduct().getPrice();
            totalRefund += refundAmount;

            OrderItemCancellation itemCancellation = new OrderItemCancellation();
            itemCancellation.setCancellation(cancellation);
            itemCancellation.setOrderItem(orderItem);
            itemCancellation.setCancelQuantity(cancelQty);
            cancellations.add(itemCancellation);
            cancellation.getOrderItemCancellations().add(itemCancellation);
            orderItem.getOrderItemCancellations().add(itemCancellation);
            orderItemRepository.save(orderItem);
        }

        increaseUserBalance(user, totalRefund);
        cancellation.setCancelAmount(totalRefund);

        return cancellations;
    }


    public Double increaseUserBalance(User user, double refundAmount) {
        user.setBalance(user.getBalance() + refundAmount);
        userRepository.save(user);
        return user.getBalance();
    }

    private void updateProductsAndItems(List<OrderItemCancellation> cancellations) {
        for (OrderItemCancellation item : cancellations) {
            OrderItem orderItem = item.getOrderItem();
            Product product = productRepository.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

            int cancelQty = item.getCancelQuantity();
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

            orderItemRepository.save(orderItem);
        }
    }


    public CancellationDto createAllOrdersCancellation(CancellationDto cancellationDto, UUID userId) {

        Orders order = orderRepository.findByIdForUpdate(cancellationDto.getOrderId())
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        List<OrderItem> orderItems = order.getOrderItems();
        Cancellation cancellation = cancellationMapper.toEntity(cancellationDto);
        double refundAmount = 0;

        for (OrderItem orderItem : orderItems) {
            orderItem.setPaymentState(PaymentState.CANCELLED);
            OrderItemCancellation orderItemCancellation = new OrderItemCancellation();
            orderItemCancellation.setOrderItem(orderItem);
            orderItemCancellation.setCancelQuantity(orderItem.getQuantity());
            orderItem.getOrderItemCancellations().add(orderItemCancellation);
            orderItemRepository.save(orderItem);
            orderItemCancellation.setCancellation(cancellation);
            cancellation.getOrderItemCancellations().add(orderItemCancellation);
            Product product = productRepository.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));
            int cancelQty = orderItem.getQuantity();
            product.getQuantity().put(
                    orderItem.getSize(),
                    product.getQuantity().getOrDefault(orderItem.getSize(), 0) + cancelQty
            );
            refundAmount += cancelQty * orderItem.getProduct().getPrice();
            productRepository.save(product);
        }

        cancellation.setCancelAmount(order.getSumPrice());
        cancellation.setOrder(order);
        cancellation.setUser(user);
        cancellationValidator.validateOrderState(order);
        cancellationValidator.validateOrderDeliveryState(order);
        cancellationValidator.cancelledOrderPayment(order);
        Cancellation savedCancellation = cancellationRepository.save(cancellationMapper.toEntity(cancellationDto));
        order.setCancellations(savedCancellation);
        orderRepository.save(order);
        return cancellationMapper.toDto(savedCancellation);
    }

    @Transactional
    public CancellationDto update(Long id, CancellationDto cancellationDto, UUID userId) {

        Cancellation cancellation = cancellationRepository.findById(id)
                .orElseThrow(() -> new CancellationNotFoundException(ErrorMesage.CANCELLATION_NOT_FOUND_ERROR));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        Orders order = orderRepository.findById(cancellation.getOrder().getId())
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        List<OrderItemCancellationDto> orderItemCancellationDtos = cancellationDto.getOrderItems();
        double refundAmount = 0;

        for (OrderItemCancellationDto orderItemCancellationDto : orderItemCancellationDtos) {
            refundAmount += processOrderItemCancellation(orderItemCancellationDto, cancellation);
        }

        user.setBalance(user.getBalance() + refundAmount);
        cancellation.setOrder(order);
        cancellation.setUser(user);

        Cancellation savedCancellation = cancellationRepository.save(cancellation);
        order.setCancellations(savedCancellation);
        orderRepository.save(order);

        return cancellationMapper.toDto(savedCancellation);
    }

    private double processOrderItemCancellation(OrderItemCancellationDto orderItemCancellationDto, Cancellation cancellation) {
        OrderItem orderItem = orderItemRepository.findById(orderItemCancellationDto.getId())
                .orElseThrow(() -> new OrderItemNotFoundException(ErrorMesage.ORDER_ITEM_NOT_FOUND_ERROR));

        OrderItemCancellation existingCancellation = findExistingCancellation(orderItem, cancellation);

        int cancelQty = orderItemCancellationDto.getCancelQuantity() - existingCancellation.getCancelQuantity();
        if (cancelQty < 0) {
            throw new CancelQuantityException(ErrorMesage.CANCEL_QUANTITY_ERROR);
        }

        updateOrderItem(orderItem, cancelQty);
        updateProduct(orderItem, cancelQty);

        existingCancellation.setCancelQuantity(orderItemCancellationDto.getCancelQuantity());
        orderItemCancellationRepository.save(existingCancellation);

        return cancelQty * orderItem.getProduct().getPrice();
    }

    private OrderItemCancellation findExistingCancellation(OrderItem orderItem, Cancellation cancellation) {
        return orderItem.getOrderItemCancellations().stream()
                .filter(c -> c.getCancellation().equals(cancellation))
                .findFirst()
                .orElseThrow(() -> new CancelQuantityException(ErrorMesage.CANCEL_QUANTITY_ERROR));
    }

    private void updateOrderItem(OrderItem orderItem, int cancelQty) {
        orderItem.setQuantity(orderItem.getQuantity() - cancelQty);
        orderItem.setPaymentState(orderItem.getQuantity() == 0 ? PaymentState.CANCELLED : PaymentState.UPDATED);
        orderItemRepository.save(orderItem);
    }

    private void updateProduct(OrderItem orderItem, int cancelQty) {
        Product product = productRepository.findById(orderItem.getProduct().getId())
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

        Map<Size, Integer> quantityMap = product.getQuantity();
        quantityMap.put(orderItem.getSize(), quantityMap.getOrDefault(orderItem.getSize(), 0) + cancelQty);
        product.setQuantity(quantityMap);
        productRepository.save(product);
    }

    public Page<CancellationDto> findAllByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Cancellation> cancellations = cancellationRepository.findAllByUserId(userId, pageable);
        Page<CancellationDto> dtoPage = cancellations.map(cancellationMapper::toDto);
        return dtoPage;
    }

    public Page<CancellationDto> findAll(int page, int size) {

        Page<Cancellation> cancellation = cancellationRepository.findAll(PageRequest.of(page, size));
        Page<CancellationDto> dtoPage = cancellation.map(cancellationMapper::toDto);
        return dtoPage;
    }

    public CancellationDto findById(Long id) {
        Cancellation cancellation = cancellationRepository.findById(id).orElseThrow(() -> new CancellationNotFoundException(ErrorMesage.CANCELLATION_NOT_FOUND_ERROR));
        return cancellationMapper.toDto(cancellation);
    }

    public void delete(Long id) {
        cancellationRepository.deleteById(id);
    }


}
