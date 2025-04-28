package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.entity.Cancellation;
import org.example.bitirmeprojesi.entity.Delivery;
import org.example.bitirmeprojesi.entity.OrderItem;
import org.example.bitirmeprojesi.entity.Orders;
import org.example.bitirmeprojesi.enums.DeliveryStatus;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.OrderNotFoundExceiption;
import org.example.bitirmeprojesi.mapper.CancellationMapper;
import org.example.bitirmeprojesi.repository.CancellationRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CancellationService {

    private final CancellationRepository cancellationRepository;
    private final CancellationMapper cancellationMapper;

    public CancellationDto create(CancellationDto cancellationDto) {
        Cancellation cancellation = cancellationMapper.toEntity(cancellationDto);
        Delivery delivery = cancellation.getOrder().getDelivery();
        if(delivery.getDeliveryState().equals(DeliveryStatus.DELIVERED)){

        }



        cancellation = cancellationRepository.save(cancellation);
        return cancellationMapper.toDto(cancellation);
    }

    public CancellationDto findById(Long id) {
        Cancellation cancellation = cancellationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cancellation not found with id: " + id));
        return cancellationMapper.toDto(cancellation);
    }

    public List<CancellationDto> findAll() {
        List<Cancellation> cancellation = cancellationRepository.findAll();
        return cancellationMapper.toDtoList(cancellation);
    }

    public CancellationDto update(CancellationDto cancellationDto, long id) {
        cancellationRepository.findById(id).get();
        Cancellation cancellation = cancellationMapper.toEntity(cancellationDto);
        cancellationRepository.save(cancellation);
        return cancellationMapper.toDto(cancellation);
    }

    public void delete(long id) {
        cancellationRepository.deleteById(id);
    }


}
