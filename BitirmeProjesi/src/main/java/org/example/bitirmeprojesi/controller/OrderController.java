package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderGetOrderItemsDto;
import org.example.bitirmeprojesi.dto.OrderItemDto;
import org.example.bitirmeprojesi.dto.OrdersDto;
import org.example.bitirmeprojesi.service.OrderItemService;
import org.example.bitirmeprojesi.service.OrderService;
import org.example.bitirmeprojesi.util.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {


    private final OrderService orderService;
    private final OrderItemService orderItemService;

    @PostMapping("/v1")
    public ResponseEntity<OrdersDto> create( @RequestBody OrdersDto ordersDto) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(orderService.create(ordersDto, userId));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<OrdersDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @GetMapping("/v1")
    public ResponseEntity<Page<OrdersDto>> findAllByUserId(@RequestParam(required = false, defaultValue = "0") int page,
                                                           @RequestParam(required = false, defaultValue = "10") int size) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(orderService.findAllByUserId(userId, page, size));
    }


    @PutMapping("/v1/{id}")
    public ResponseEntity<OrdersDto> update(@RequestBody OrdersDto ordersDto, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.update(ordersDto, id));
    }

    @GetMapping("/v1/orderItems/{id}")
    public ResponseEntity<OrderGetOrderItemsDto> getOrderItemsById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderItemsById(id));
    }

    @GetMapping("/v1/orderItem/{id}")
    public ResponseEntity<List<OrderItemDto>> getOrderItemsByUserId(@PathVariable Long id) {
        UUID userId = JwtUtil.getUserIdFromToken();
        return ResponseEntity.ok(orderItemService.findByOrderId(userId, id));
    }


    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
