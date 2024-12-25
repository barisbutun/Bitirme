package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.entity.Category;
import org.example.bitirmeprojesi.entity.Favourite;
import org.example.bitirmeprojesi.entity.Product;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.CategoryNotFoundException;
import org.example.bitirmeprojesi.exception.error.ProductNotFoundException;
import org.example.bitirmeprojesi.exception.error.UserIdNotFoundException;
import org.example.bitirmeprojesi.mapper.FavouriteMapper;
import org.example.bitirmeprojesi.repository.CategoryRepository;
import org.example.bitirmeprojesi.repository.FavouriteRepository;
import org.example.bitirmeprojesi.repository.ProductRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteMapper favouriteMapper;
    private final FavouriteRepository favouriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public FavouriteDto create(FavouriteDto favouriteDto, UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserIdNotFoundException(ErrorMesage.USER_ID_NOT_FOUND_ERROR));

        Product product = productRepository.findById(favouriteDto.getProductId()).orElseThrow(() -> new ProductNotFoundException(ErrorMesage.PRODUCT_NOT_FOUND_ERROR));

        Category category= categoryRepository.findById(favouriteDto.getCategoryId()).orElseThrow(() -> new CategoryNotFoundException(ErrorMesage.CATEGORY_NOT_FOUND_ERROR));


        Favourite favourite = favouriteMapper.toEntity(favouriteDto);
        favourite.setProduct(product);
        favourite.setUser(user);
        favourite.setCategory(category);
        favourite = favouriteRepository.save(favourite);

        return favouriteMapper.toDto(favourite);
    }
    public void delete(Long id) {
        favouriteRepository.deleteById(id);
    }

    public List<FavouriteDto> findAll(){
       List<Favourite> favourite=favouriteRepository.findAll().stream().toList();
       List<FavouriteDto> favouriteDto=favouriteMapper.toDtoList(favourite);
       return favouriteDto;
    }
    public FavouriteDto update(FavouriteDto favouriteDto,long id){
        Favourite favourite=favouriteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("favourite product not found with id:"+id));
        favouriteMapper.update(favouriteDto,favourite);
        favouriteRepository.save(favourite);
        return favouriteMapper.toDto(favourite);
    }

    public List<FavouriteDto> getlAllByUserId(UUID userId) {
        userRepository.findById(userId).orElseThrow(() -> new AccountNotFoundException("Account bulunamadı"));

        List<Favourite> favourites = favouriteRepository.findByUserId(userId);

        return favouriteMapper.toDtoList(favourites);
    }

    public FavouriteDto findById(long id) {
        return favouriteMapper.toDto(favouriteRepository.findById(id).get());
    }
}
