package org.example.bitirmeprojesi.service;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.mapper.ProductMapper;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public Long create(ProductDto productDto) {

        Product product = productMapper.toEntity(productDto);
        productRepository.save(product);
        return product.getId();
    }

    public ProductDto findById(long id) {
        Product product = productRepository.findById(id).get();
        return productMapper.toDto(product);
    }

    public List<ProductDto> findAll() {
        return productMapper.toDtoList(productRepository.findAll());
    }

    public ProductDto update(ProductDto productDto,long id){
        Product product=productRepository.findById(id).get();
        productMapper.Update(productDto,product);
        productRepository.save(product);
        return productMapper.toDto(product);
    }

    public void delete(long id){
        productRepository.deleteById(id);
    }

}
