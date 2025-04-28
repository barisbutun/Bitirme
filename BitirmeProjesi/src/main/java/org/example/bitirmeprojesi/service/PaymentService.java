package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.bitirmeprojesi.dto.DeliveryDto;
import org.example.bitirmeprojesi.dto.PaymentDto;
import org.example.bitirmeprojesi.entity.*;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.*;
import org.example.bitirmeprojesi.mapper.PaymentMapper;
import org.example.bitirmeprojesi.repository.*;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class PaymentService {


    private final PaymentRepository paymentRepository;
    private final DeliveryService deliveryService;
    private final PaymentMapper paymentMapper;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ShoppingCartItemService shoppingCartItemService;
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public PaymentDto create(PaymentDto paymentDto) {
        Payment payment = paymentMapper.toEntity(paymentDto);

        UUID userId = JwtUtil.getUserIdFromToken();
        User user = userRepository.findById(userId).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        Orders orders = orderRepository.findById(paymentDto.getOrderId()).orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        if (orders.getSumPrice() > user.getBalance()) {
            throw new InsufficientBalanceError(ErrorMesage.INSUFFICIENT_BALANCE_ERROR);
        }
        DeliveryDto deliveryDto = new DeliveryDto();
        user.setBalance(user.getBalance() - orders.getSumPrice());
        userRepository.save(user);
        deliveryService.create(deliveryDto, orders);
        payment.setPaymentState(PaymentState.SUCCESS);
        List<OrderItem> orderItem=orders.getOrderItems();
        orderItem.forEach(orderItem1 -> orderItem1.setPaymentState(PaymentState.SUCCESS));
        for(OrderItem orderItem1:orderItem){
            Product product = productRepository.findByIdForUpdate(orderItem1.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));
            product.setQuantity(product.getQuantity() - orderItem1.getQuantity());
            productRepository.save(product);
        }
        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemRepository.findByUserId(userId);
        shoppingCartItemService.deleteAllByUserId(userId);
        shoppingCartItemRepository.saveAll(shoppingCartItems);
        paymentRepository.save(payment);
        return paymentMapper.toDto(payment);
    }

    public PaymentDto findById(UUID id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(ErrorMesage.PAYMENT_NOT_FOUND_ERROR));
        return paymentMapper.toDto(payment);
    }

    public Page<PaymentDto> findAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> payments = paymentRepository.findAll(pageable);
        Page<PaymentDto> dtoPage = payments.map(paymentMapper::toDto);
        return dtoPage;
    }

    public Page<PaymentDto> findAllByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> payments = paymentRepository.findAllByUserId(userId, pageable);
        Page<PaymentDto> dtoPage = payments.map(paymentMapper::toDto);
        return dtoPage;
    }

    public PaymentDto update(PaymentDto paymentDto, UUID id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(ErrorMesage.PAYMENT_NOT_FOUND_ERROR));
        paymentMapper.update(paymentDto, payment);
        paymentRepository.save(payment);
        return paymentMapper.toDto(payment);
    }

    public void delete(UUID id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(ErrorMesage.PAYMENT_NOT_FOUND_ERROR));
        paymentRepository.delete(payment);
    }


}
