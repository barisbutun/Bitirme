package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.bitirmeprojesi.dto.DeliveryDto;
import org.example.bitirmeprojesi.dto.PaymentDto;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.entity.Payment;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.enums.PaymentState;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.InsufficientBalanceError;
import org.example.bitirmeprojesi.exception.error.OrderNotFoundExceiption;
import org.example.bitirmeprojesi.exception.error.PaymentNotFoundException;
import org.example.bitirmeprojesi.mapper.PaymentMapper;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.example.bitirmeprojesi.repository.PaymentRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.stereotype.Service;

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
        paymentRepository.save(payment);
        return paymentMapper.toDto(payment);
    }

    public PaymentDto findById(UUID id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(ErrorMesage.PAYMENT_NOT_FOUND_ERROR));
        return paymentMapper.toDto(payment);
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
