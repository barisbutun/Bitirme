package org.example.bitirmeprojesi.service;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.dto.UserPatchDto;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.mapper.UserMapper;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserDto create(UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        userRepository.save(user);
        return userMapper.toDto(user);
    }

    public UserDto findById(UUID id) {
        User user = userRepository.findById(id).get();
        return userMapper.toDto(user);
    }

    public List<UserDto> findAll() {

        return userMapper.toDtoList(userRepository.findAll());
    }

    public UserDto update(UserDto userDto, UUID id) {
        User user = userRepository.findById(id).get();
        userMapper.update(userDto,user);
        userRepository.save(user);

        return userMapper.toDto(user);
    }
    public UserPatchDto updateUserPartially(UserPatchDto userPatchDto, UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        userMapper.update(userPatchDto, user);
        userRepository.save(user);
        return userMapper.toDtoUpdate(user);

    }
    public void delete(UUID id) {
        userRepository.deleteById(id);
    }
}
