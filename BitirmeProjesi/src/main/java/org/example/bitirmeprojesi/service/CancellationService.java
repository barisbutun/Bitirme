package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.dto.OrderItemCancellationDto;
import org.example.bitirmeprojesi.entity.*;
import org.example.bitirmeprojesi.enums.PaymentState;
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
import java.util.Objects;
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

    @Transactional
    public CancellationDto create(CancellationDto cancellationDto, UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        Orders order = orderRepository.findByIdForUpdate(cancellationDto.getOrderId())
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        Cancellation cancellation = cancellationMapper.toEntity(cancellationDto);
        cancellationValidator.validateOrderState(order);
        List<OrderItem> orderItems = processOrderItems(cancellationDto, user, cancellation);

        updateProductsAndOrderItems(orderItems, cancellationDto);
        cancellation.setOrderItems(orderItems);
        cancellation.setUser(user);
        orderItemRepository.saveAll(orderItems);


        return cancellationMapper.toDto(cancellationRepository.save(cancellation));
    }



    private List<OrderItem> processOrderItems(CancellationDto cancellationDto, User user, Cancellation cancellation) {
        double totalRefund = 0;

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemCancellationDto dto : cancellationDto.getOrderItems()) {
            OrderItem orderItem = orderItemRepository.findById(dto.getId())
                    .orElseThrow(() -> new OrderItemNotFoundException(ErrorMesage.ORDER_ITEM_NOT_FOUND_ERROR));

            int cancelQty = dto.getCancelQuantity();
            orderItem.setQuantity(orderItem.getQuantity() - cancelQty);

            double refundAmount = cancelQty * orderItem.getProduct().getPrice();
            totalRefund += refundAmount;

            orderItem.setCancellation(cancellation);
            items.add(orderItem);
        }

        user.setBalance(user.getBalance() + totalRefund);
        userRepository.save(user);
        cancellation.setCancelAmount(totalRefund); // 🔁 toplamı bir kez set ediyoruz

        return items;
    }


    private void updateProductsAndOrderItems(List<OrderItem> orderItems, CancellationDto cancellationDto) {
        orderItems.forEach(orderItem -> {
            Product product = productRepository.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

            int cancelQty = cancellationDto.getOrderItems().stream()
                    .filter(item -> Objects.equals(item.getId(), orderItem.getId()))
                    .map(OrderItemCancellationDto::getCancelQuantity)
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


    public CancellationDto createAllOrdersCancellation(CancellationDto cancellationDto) {

        Cancellation cancellation = cancellationMapper.toEntity(cancellationDto);

        Orders order = orderRepository.findByIdForUpdate(cancellation.getOrder().getId())
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        cancellationValidator.validateOrderDeliveryState(order);
        cancellationValidator.cancelledOrderPayment(order);
        Cancellation savedCancellation = cancellationRepository.save(cancellationMapper.toEntity(cancellationDto));

        return cancellationMapper.toDto(savedCancellation);
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

    @Transactional
    public CancellationDto update(CancellationDto cancellationDto, Long id,UUID userId) {

        Cancellation existingCancellation = cancellationRepository.findById(id)
                .orElseThrow(() -> new CancellationNotFoundException(ErrorMesage.CANCELLATION_NOT_FOUND_ERROR));

        User user =userRepository.findById(userId)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));

        Orders orders = orderRepository.findByIdForUpdate(cancellationDto.getOrderId())
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        cancellationMapper.update(cancellationDto, existingCancellation);


        List<OrderItem> orderItems = processOrderItems(cancellationDto, user, existingCancellation);

        updateProductsAndOrderItems(orderItems, cancellationDto);

        cancellationRepository.save(existingCancellation);

        return cancellationMapper.toDto(existingCancellation);
    }

    public void delete(Long id) {
        cancellationRepository.deleteById(id);
    }


}
