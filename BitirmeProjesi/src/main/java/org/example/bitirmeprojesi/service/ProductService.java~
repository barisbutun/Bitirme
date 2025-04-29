package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Category;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.CategoryNotFoundException;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.mapper.ProductMapper;
import org.example.bitirmeprojesi.repository.CategoryRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.repository.ReviewRepository;
import org.example.bitirmeprojesi.validator.ProductValidator;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final ProductValidator productValidator;
    private final ReviewRepository reviewRepository;


    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto create(ProductDto productDto) throws Exception {
        if (productDto.getCategoryId() == null) {
            throw new RuntimeException("Category ID is required");
        }
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(ErrorMesage.CATEGORY_NOT_FOUND_ERROR));

        Product product = productMapper.toEntity(productDto);
        product.setCategory(category);
        productValidator.checkStokState(productDto,product);
        productRepository.save(product);
        productDto.setId(product.getId());
        log.info("Product created: {}", product);
        return productMapper.toDto(product);
    }

    public Page<ProductDto> getTopRatedProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("averageRating")));
        Page<Product> products = productRepository.findAllRatedProducts(pageable);
        Page<ProductDto> dtoPage=products.map(productMapper::toDto);
        return dtoPage;
    }

    public int getReviewCountForProduct(Long productId) {
        return reviewRepository.countByProductId(productId);
    }

    public List<ProductDto> getRatedProductsOnly(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findAllRatedProducts(pageable);
        List<Product> productsList= products.getContent();

        return productMapper.toDtoList(productsList);
    }

    public Integer getProductCount() {
        return Math.toIntExact(productRepository.count());
    }



    public ProductDto findById(long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));
        return productMapper.toDto(product);
    }

    @Cacheable(value = "products", key = "'page_'+#page+'_size_'+#size")
    public Page<ProductDto> findAll(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findAll(pageable);


        Page<ProductDto> dtoPage = productPage.map(productMapper::toDto);

        log.info("Product Page: {}", dtoPage);
        return dtoPage;
    }

    @CacheEvict(value = "products", allEntries = true)
    public ProductDto update(ProductDto productDto, long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

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

    @CacheEvict(value = "products", allEntries = true)
    public void delete(long id) {
        productRepository.deleteById(id);
    }

}
