package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderDto;
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

    public OrderDto create(OrderDto orderDto){
        Orders orders =orderMapper.toEntity(orderDto);
        orderRepository.save(orders);
        return orderMapper.toDto(orders);
    }

    public OrderDto findById(Long id){
        Orders orders =orderRepository.findById(id).get();
        return orderMapper.toDto(orders);
    }

    public List<OrderDto> findAll(){
        List<Orders> ordersList =orderRepository.findAll();
        return orderMapper.toDtoList(ordersList);
    }
    public OrderDto update(OrderDto orderDto,long id){
        Orders orders =orderRepository.findById(id).get();
        orderMapper.update(orderDto, orders);
        orderRepository.save(orders);
        return orderMapper.toDto(orders);
    }

    public void  delete (long id){
        orderRepository.deleteById(id);

    }

}
