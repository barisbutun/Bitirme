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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        return userRepository.findActiveByEmail(email);
    }


    public UserDto findById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        return userMapper.toDto(user);
    }

    public Integer countUser() {
        return Math.toIntExact(userRepository.count());
    }


    public Page<UserDto> findAll(int page, int size) {

        Pageable pageable= PageRequest.of(page, size);

        Page<User> users = userRepository.findAll(pageable);
        Page<UserDto> userDtos = users.map(userMapper::toDto);
       return userDtos;
    }

    public UserDto update(UserDto userDto, String code) throws CodeNotFoundException {
        TemproraryUser temproraryUser = temproraryUserRepository.findByCode(code);
        if (temproraryUser == null) {
            throw new CodeNotFoundException(ErrorMesage.CODE_NOT_FOUND_ERROR);
        }
        User user = userRepository.findActiveByEmail(temproraryUser.getEmail()).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
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

    public UserDto uploadBalance(UUID id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        double balance = userDto.getBalance();
        user.setBalance(user.getBalance() + balance);
        userRepository.save(user);
        return userMapper.toDto(user);
    }

    public UserDto update(UserDto userDto, UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        userMapper.update(userDto, user);
        userRepository.save(user);
        return userMapper.toDto(user);

    }

    public void delete(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        user.setRegistered(false);
        user.setDeleted(true);
        userRepository.save(user);
    }

    public void deleteById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        userRepository.delete(user);
    }



    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findActiveByEmail(email)
                .orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
    }


    public UserProfileDto getUserProfile(UUID userId) {
        return userMapper.toDtoProfile(userRepository.findById(userId).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR)));
    }
}

