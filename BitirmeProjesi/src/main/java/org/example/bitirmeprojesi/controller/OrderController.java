package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.OrderDto;
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
    public ResponseEntity<OrderDto> create(OrderDto orderDto){
        return ResponseEntity.ok(orderService.create(orderDto));
    }

    @GetMapping("/v1/{id}")
    public ResponseEntity<OrderDto> findById(Long id){
        return ResponseEntity.ok(orderService.findById(id));
    }

    @GetMapping("/v1")
    public ResponseEntity<List<OrderDto>> findAll(){
        return ResponseEntity.ok(orderService.findAll());
    }

    @PutMapping("/v1/{id}")
    public ResponseEntity<OrderDto> update(OrderDto orderDto,long id){
        return ResponseEntity.ok(orderService.update(orderDto,id));
    }

    @DeleteMapping("/v1/{id}")
    public ResponseEntity<Void> delete(long id){
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
