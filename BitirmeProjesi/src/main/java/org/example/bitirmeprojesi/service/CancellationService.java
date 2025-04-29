package org.example.bitirmeprojesi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.entity.Cancellation;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.CancellationNotFoundException;
import org.example.bitirmeprojesi.exception.error.OrderItemNotFoundException;
import org.example.bitirmeprojesi.exception.error.OrderNotFoundExceiption;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.mapper.CancellationMapper;
import org.example.bitirmeprojesi.repository.CancellationRepository;
import org.example.bitirmeprojesi.repository.OrderItemRepository;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.validator.CancellationValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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


    @Transactional
    public CancellationDto create(CancellationDto cancellationDto) {
        Cancellation cancellation = cancellationMapper.toEntity(cancellationDto);

        Orders order = orderRepository.findByIdForUpdate(cancellation.getOrder().getId())
                .orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        OrderItem orderItem = orderItemRepository.findByIdForUpdate(cancellationDto.getOrderItemId())
                .orElseThrow(() -> new OrderItemNotFoundException(ErrorMesage.ORDER_ITEM_NOT_FOUND_ERROR));

        cancellationValidator.validateOrderDeliveryState(order);
        cancellationValidator.updateOrderItemQuantity(orderItem, cancellationDto.getQuantity());
        cancellationValidator.updateUserBalance(order.getUser(), orderItem, cancellationDto.getQuantity());
        cancellationValidator.updateOrderItemPayment(orderItem, order, cancellationDto);
        cancellationValidator.amountCancelPrice(cancellation,orderItem,cancellationDto.getQuantity());

        Product product = productRepository.findByIdForUpdate(orderItem.getProduct().getId())
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

        cancellationValidator.validateStockState(product, orderItem,cancellationDto.getQuantity());

        Cancellation savedCancellation = cancellationRepository.save(cancellation);

        return cancellationMapper.toDto(savedCancellation);
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
    public CancellationDto update(CancellationDto cancellationDto, Long id) {
        cancellationRepository.findById(id).orElseThrow(() -> new CancellationNotFoundException(ErrorMesage.CANCELLATION_NOT_FOUND_ERROR));
        Cancellation cancellation = cancellationMapper.toEntity(cancellationDto);
        cancellationRepository.save(cancellation);
        return cancellationMapper.toDto(cancellation);
    }

    public void delete(Long id) {
        cancellationRepository.deleteById(id);
    }


}
