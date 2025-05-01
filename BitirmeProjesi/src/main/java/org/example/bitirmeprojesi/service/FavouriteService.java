package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.entity.Category;
import org.example.bitirmeprojesi.entity.Favourite;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.*;
import org.example.bitirmeprojesi.mapper.FavouriteMapper;
import org.example.bitirmeprojesi.repository.CategoryRepository;
import org.example.bitirmeprojesi.repository.FavouriteRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteMapper favouriteMapper;
    private final FavouriteRepository favouriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @CacheEvict(value = "products", allEntries = true)
    public List<FavouriteDto> create(FavouriteDto favouriteDto, UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserIdNotFoundException(ErrorMesage.USER_ID_NOT_FOUND_ERROR));

        Product product = productRepository.findById(favouriteDto.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));
        product.setFavouriteCount(product.getFavouriteCount() + 1);
        productRepository.save(product);
        Category category = categoryRepository.findById(favouriteDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(ErrorMesage.CATEGORY_NOT_FOUND_ERROR));

        if (!Objects.equals(productRepository.findCategoryIdByProductId(favouriteDto.getProductId()), favouriteDto.getCategoryId())) {
            throw new ConflictProductAndCategoryException(ErrorMesage.CONFLICT_PRODUCT_AND_CATEGORY);
        }

        List<Favourite> favourites = favouriteRepository.findByUserId(userId);

        boolean isProductAlreadyFavorited = favourites.stream()
                .anyMatch(fav -> Objects.equals(fav.getProduct().getId(), favouriteDto.getProductId()));

        if (isProductAlreadyFavorited) {
            throw new ExistingProductException(ErrorMesage.EXISTING_PRODUCT_ERROR);
        }

        Favourite favourite = favouriteMapper.toEntity(favouriteDto);
        favourite.setProduct(product);
        favourite.setUser(user);
        favourite.setCategory(category);
        favouriteRepository.save(favourite);

        return favouriteRepository.findByUserId(userId)
                .stream()
                .map(favouriteMapper::toDto)
                .collect(Collectors.toList());
    }
    @CacheEvict(value = "products", allEntries = true)
    public void delete(UUID userId, Long id) {
        Favourite favourite = favouriteRepository.findByUserId(userId).stream()
                .filter(f -> f.getId()==id)
                .findFirst()
                .orElseThrow(() -> new FavouriteNotFoundException(ErrorMesage.FAVOURITE_NOT_FOUND_ERROR));

        Product product = favourite.getProduct();
        product.setFavouriteCount(product.getFavouriteCount() - 1);
        productRepository.save(product);
        favouriteRepository.deleteById(favourite.getId());
    }

    public Integer getFavouriteCountByUserId(UUID userId) {
        return favouriteRepository.countByUserId(userId);
    }


    public Page<FavouriteDto> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Favourite> favourites = favouriteRepository.findAll(pageable);
        Page<FavouriteDto> dtoPage = favourites.map(favouriteMapper::toDto);
        return dtoPage;
    }

    public FavouriteDto update(FavouriteDto favouriteDto,long id){
        Favourite favourite=favouriteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("favourite product not found with id:"+id));
        favouriteMapper.update(favouriteDto,favourite);
        favouriteRepository.save(favourite);
        return favouriteMapper.toDto(favourite);
    }


    public Page<FavouriteDto> getlAllByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        userRepository.findById(userId).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        Page<Favourite> favourites = favouriteRepository.findByUserId(userId, pageable);
        Page<FavouriteDto> dtoPage=favourites.map(favouriteMapper::toDto);

        return dtoPage;
    }

    public FavouriteDto findById(long id) {
        return favouriteMapper.toDto(favouriteRepository.findById(id).orElseThrow(() -> new FavouriteNotFoundException(ErrorMesage.FAVOURITE_NOT_FOUND_ERROR)));
    }
}
