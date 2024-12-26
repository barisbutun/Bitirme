package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.ProductElastic;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.QueryNotFoundException;
import org.example.bitirmeprojesi.mapper.ProductElasticMapper;
import org.example.bitirmeprojesi.repository.ProductElasticRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ProductElasticService {

    private final ProductElasticRepository productElasticRepository;
    private final ProductElasticMapper productMapper;


    public List<ProductDto> searchByQuery(String query) {

        if(query==null||query.isBlank()){
            throw new QueryNotFoundException(ErrorMesage.QUERY_NOT_FOUND_ERROR);
        }
        List<ProductElastic> productElastics=productElasticRepository.findByAutocomplete(query);
        List<ProductDto> ProductDto=productMapper.toDtoList(productElastics);
        return ProductDto;
    }


}
