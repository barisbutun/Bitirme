package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.entity.Favourite;
import org.example.bitirmeprojesi.mapper.FavouriteMapper;
import org.example.bitirmeprojesi.repository.FavouriteRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteMapper favouriteMapper;
    private final FavouriteRepository favouriteRepository;
    private final TokenService tokenService;


    public FavouriteDto create(FavouriteDto favouriteDto) {
        Favourite favourite = favouriteMapper.toEntity(favouriteDto);
        favourite = favouriteRepository.save(favourite);
        return favouriteMapper.toDto(favourite);
    }
    public void delete(Long id) {
        favouriteRepository.deleteById(id);
    }

}
