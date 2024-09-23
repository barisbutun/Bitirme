package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderDto;
import org.example.bitirmeprojesi.entity.Order;
import org.example.bitirmeprojesi.mapper.OrderMapper;
import org.example.bitirmeprojesi.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public Long create(OrderDto orderDto){
        Order order=orderMapper.toEntity(orderDto);
        return orderRepository.save(order).getId();
    }

    public OrderDto findById(Long id){
        Order order=orderRepository.findById(id).orElseThrow(()->new RuntimeException("Order not found"));
        return orderMapper.toDto(order);
    }

    public List<OrderDto> findAll(){
        List<Order> orderList=orderRepository.findAll();
        return orderMapper.toDtoList(orderList);
    }
    public OrderDto update(OrderDto orderDto,long id){
        orderRepository.findById(id).orElseThrow(()->new RuntimeException("Order not found()->"));
        Order order=orderMapper.toEntity(orderDto);
        orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    public void  delete (long id){
        orderRepository.deleteById(id);

    }

}
