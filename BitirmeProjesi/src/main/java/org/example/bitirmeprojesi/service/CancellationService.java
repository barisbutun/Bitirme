package org.example.bitirmeprojesi.service;

import org.example.bitirmeprojesi.entity.Cancellation;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.CancellationDto;
import org.example.bitirmeprojesi.mapper.CancellationMapper;
import org.example.bitirmeprojesi.repository.CancellationRepository;
import org.springframework.stereotype.Service;

import java.util.List;



@Service
@RequiredArgsConstructor
public class CancellationService {

    private final CancellationRepository cancellationRepository;
    private final CancellationMapper cancellationMapper;

    public Long create(CancellationDto cancellationDto){
        Cancellation cancellation=cancellationMapper.toEntity(cancellationDto);
       cancellation= cancellationRepository.save(cancellation);
        return cancellation.getId();
    }
    public CancellationDto findById(Long id){
        Cancellation cancellation=cancellationRepository.findById(id).orElseThrow(()->new RuntimeException("Cancellation not found"));
        return cancellationMapper.toDto(cancellation);
    }

    public List<CancellationDto> findAll(){
        List<Cancellation> cancellation=cancellationRepository.findAll();
        return cancellationMapper.toDtoList(cancellation);
    }
    public CancellationDto update(CancellationDto cancellationDto,long id){
        cancellationRepository.findById(id).orElseThrow(()->new RuntimeException("Cancellation not found()->"));
        Cancellation cancellation=cancellationMapper.toEntity(cancellationDto);
        cancellationRepository.save(cancellation);
        return cancellationMapper.toDto(cancellation);
    }
    public void  delete (long id){
        cancellationRepository.deleteById(id);
    }


}
