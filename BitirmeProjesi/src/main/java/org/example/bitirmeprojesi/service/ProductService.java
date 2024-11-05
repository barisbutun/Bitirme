package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.ImageResponseDto;
import org.example.bitirmeprojesi.dto.ProductDto;
import org.example.bitirmeprojesi.entity.Category;
import org.example.bitirmeprojesi.entity.Image;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.CategoryNotFoundException;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.mapper.CategoryMapper;
import org.example.bitirmeprojesi.mapper.ProductMapper;
import org.example.bitirmeprojesi.repository.CategoryRepository;
import org.example.bitirmeprojesi.repository.ImageRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.util.ImageUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryMapper categoryMapper;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final ImageService imageService;

    public ProductDto create(ProductDto productDto) {
        if (productDto.getCategoryId() == null) {
            throw new RuntimeException("Category ID is required");
        }

        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(ErrorMesage.CATEGORY_NOT_FOUND_ERROR, productDto.getCategoryId()));

        try {
            imageService.upload((MultipartFile) productDto.getImages());
        } catch (IOException e) {

            throw new RuntimeException("Image upload failed", e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        List<Image> images = imageRepository.findByNames(productDto.getName());
        Product product = productMapper.toEntity(productDto);
        product.setCategory(category);
        product.setImages(images);
        productRepository.save(product);

        return productMapper.toDto(product);
    }


    public ProductDto findById(long id) {

        Product product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));
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
