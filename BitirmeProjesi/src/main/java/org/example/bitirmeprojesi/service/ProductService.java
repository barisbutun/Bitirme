package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.mapper.ProductMapper;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductDto create(ProductDto productDto) {

        Product product = productMapper.toEntity(productDto);
        productRepository.save(product);
        return productMapper.toDto(product);

    }


    public ProductDto findById(long id) {

        Product product = productRepository.findById(id).get();
        return productMapper.toDto(product);
    }

    public List<ProductDto> findAll(int page, int size) {
        Pageable pageable =  PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findAll(pageable);
        return productMapper.toDtoList(productPage.getContent());
    }

    public ProductDto update(ProductDto productDto, long id) {

        Product product = productRepository.findById(id).get();
        productMapper.update(productDto, product);
        productRepository.save(product);
        return productMapper.toDto(product);
    }

    public List<ProductDto> filterbyProduct(String name,
                                            String category,
                                            Double minPrice,
                                            Double maxPrice) {
        return productMapper.toDtoList(productRepository.findByFilters(name, category, minPrice, maxPrice));
    }

    public void delete(long id) {
        productRepository.deleteById(id);
    }

}
