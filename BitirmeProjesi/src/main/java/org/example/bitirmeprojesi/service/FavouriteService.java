package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.FavouriteDto;
import org.example.bitirmeprojesi.entity.Favourite;
import org.example.bitirmeprojesi.mapper.FavouriteMapper;
import org.example.bitirmeprojesi.repository.FavouriteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

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

    public FavouriteDto findById(long id) {
        return favouriteMapper.toDto(favouriteRepository.findById(id).get());
    }
}
