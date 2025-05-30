package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.QueryRequest;
import org.example.bitirmeprojesi.dto.UserElasticDto;
import org.example.bitirmeprojesi.entity.UserElastic;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.QueryNotFoundException;
import org.example.bitirmeprojesi.mapper.UserElasticMapper;
import org.example.bitirmeprojesi.repository.UserElasticRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserElasticService {


    private final UserElasticRepository userElasticRepository;
    private final UserElasticMapper userElasticMapper;

    public List<UserElasticDto> searchByQuery(QueryRequest queryRequest) {


        if(queryRequest.getQuery()==null||queryRequest.getQuery().isBlank()){
            throw new QueryNotFoundException(ErrorMesage.QUERY_NOT_FOUND_ERROR);
        }
        List<UserElastic> userElastics=userElasticRepository.findByNameOrEmail(queryRequest.getQuery());
        List<UserElasticDto> userElasticDtos=userElasticMapper.toDtoList(userElastics);
        return userElasticDtos;
    }



}
