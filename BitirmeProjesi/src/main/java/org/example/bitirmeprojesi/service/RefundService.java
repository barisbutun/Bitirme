package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.RefundDto;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.entity.Refund;
import org.example.bitirmeprojesi.enums.RefundStatus;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.OrderNotFoundExceiption;
import org.example.bitirmeprojesi.mapper.RefundMapper;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.example.bitirmeprojesi.repository.RefundRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRepository refundRepository;
    private final RefundMapper refundMapper;
    private final OrderRepository orderRepository;

    public RefundDto create(RefundDto refundDto){




        Refund refund = refundMapper.toEntity(refundDto);

        Orders orders=orderRepository.findById(refund.getOrders().getId()).orElseThrow(() -> new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR));

        if(!orders.getDelivery().getDeliveryState().equals("DELIVERED")){
            throw new OrderNotFoundExceiption(ErrorMesage.ORDER_NOT_FOUND_ERROR);
        }


        refund.setOrders(orders);

        refund.setStatus(RefundStatus.REQUESTED);




        return null;
    }




}
