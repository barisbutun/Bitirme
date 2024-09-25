package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public OrdersDto create(OrdersDto ordersDto){
        Orders orders =orderMapper.toEntity(ordersDto);
        orderRepository.save(orders);
        return orderMapper.toDto(orders);
    }

    public OrdersDto findById(Long id){
        Orders orders =orderRepository.findById(id).get();
        return orderMapper.toDto(orders);
    }

    public List<OrdersDto> findAll(){
        List<Orders> ordersList =orderRepository.findAll();
        return orderMapper.toDtoList(ordersList);
    }
    public OrdersDto update(OrdersDto ordersDto, long id){
        Orders orders =orderRepository.findById(id).get();
        orderMapper.update(ordersDto, orders);
        orderRepository.save(orders);
        return orderMapper.toDto(orders);
    }

    public void  delete (long id){
        orderRepository.deleteById(id);

    }

}
