package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderGetOrderItemsDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {


    private final OrderService orderService;

    @PostMapping("/v1")
    public ResponseEntity<OrdersDto> create(String userId, OrdersDto ordersDto) {
        return ResponseEntity.ok(orderService.create(userId, ordersDto));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<OrdersDto> findById(Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }



    @PutMapping("/v1/{id}")
    public ResponseEntity<OrdersDto> update(@RequestBody OrdersDto ordersDto, long id) {
        return ResponseEntity.ok(orderService.update(ordersDto, id));
    }

    @GetMapping("/v1/orderItems/{id}")
    public ResponseEntity<OrderGetOrderItemsDto> getOrderItemsById(Long id) {
        return ResponseEntity.ok(orderService.getOrderItemsById(id));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
