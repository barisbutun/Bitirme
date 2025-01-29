package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.dto.UserPatchDto;
import org.example.bitirmeprojesi.dto.UserProfileDto;
import org.example.bitirmeprojesi.entity.TemproraryUser;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.CodeNotFoundException;
import org.example.bitirmeprojesi.mapper.UserMapper;
import org.example.bitirmeprojesi.repository.TemproraryUserRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final TemproraryUserRepository temproraryUserRepository;
    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;


    public UserDto googleRegister(UserDto userDto) {
        return userMapper.toDto(userRepository.save(userMapper.toEntity(userDto)));
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public UserDto findById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        return userMapper.toDto(user);
    }

    public List<UserDto> findAll() {
        return userMapper.toDtoList(userRepository.findAll());
    }

    public UserDto update(UserDto userDto, String code) throws CodeNotFoundException {
        TemproraryUser temproraryUser = temproraryUserRepository.findByCode(code);
        if (temproraryUser == null) {
            throw new CodeNotFoundException(ErrorMesage.CODE_NOT_FOUND_ERROR);
        }
        User user = userRepository.findByEmail(temproraryUser.getEmail()).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        userMapper.update(userDto, user);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
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


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
    }


    public UserProfileDto getUserProfile(String email) {
        return userMapper.toDtoProfile(userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email)));
    }
}

