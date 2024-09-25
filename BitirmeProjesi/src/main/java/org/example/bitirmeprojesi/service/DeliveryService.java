package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.DeliveryDto;
import org.example.bitirmeprojesi.entity.Delivery;
import org.example.bitirmeprojesi.mapper.DeliveryMapper;
import org.example.bitirmeprojesi.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper deliveryMapper;

    public DeliveryDto create(DeliveryDto deliveryDto) {
        Delivery delivery = deliveryMapper.toEntity(deliveryDto);
        deliveryRepository.save(delivery);
        return deliveryMapper.toDto(delivery);
    }

    public DeliveryDto findById(UUID id) {
        Delivery delivery = deliveryRepository.findById(id).get();
        return deliveryMapper.toDto(delivery);
    }

    public List<DeliveryDto> findAll() {
        List<Delivery> deliveryList = deliveryRepository.findAll();
        return deliveryMapper.toDtoList(deliveryList);
    }

    public DeliveryDto update(DeliveryDto deliveryDto, UUID id) {
        Delivery delivery = deliveryRepository.findById(id).get();
        deliveryMapper.update(deliveryDto, delivery);
        deliveryRepository.save(delivery);
        return deliveryMapper.toDto(delivery);
    }

    public void delete(UUID id) {
        deliveryRepository.deleteById(id);
    }
}
