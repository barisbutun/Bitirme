package org.example.bitirmeprojesi.service;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.mapper.UserMapper;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public long create(UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        userRepository.save(user);
        return user.getId();
    }

    public UserDto findById(long id) {
        User user = userRepository.findById(id).get();
        return userMapper.toDto(user);
    }

    public List<UserDto> findAll() {

        return userMapper.toDtoList(userRepository.findAll());
    }
    public UserDto update(UserDto userDto){
        User user=userRepository.findById(userDto.getId()).get();
        userMapper.Update(userDto,user);
        userRepository.save(user);

        return userMapper.toDto(user);
    }
    public void delete(long id){
        userRepository.deleteById(id);
    }
}
