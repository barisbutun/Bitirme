package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
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

    public List<ProductDto> findByNameOrDescription(String name, String description) {
        log.info(("query: " + name + " " + description));
        List<ProductElastic> productElastics = productElasticRepository.findByNameOrDescription(name, description);
        return productMapper.toDtoList(productElastics);
    }



}
