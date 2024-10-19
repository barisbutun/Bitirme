package org.example.bitirmeprojesi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.LoginResponseDto;
import org.example.bitirmeprojesi.dto.RegisterDto;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.dto.UserPatchDto;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.enums.Role;
import org.example.bitirmeprojesi.mapper.UserMapper;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final TokenService tokenService;

    private final PasswordEncoder passwordEncoder;

    private AuthenticationManager authenticationManager;

    public UserDto register(RegisterDto registerDto) {

        String encodePassword = passwordEncoder.encode(registerDto.getPassword());
        User user = userMapper.toEntity(registerDto);
        user.setRole(Role.USER);
        user.setPassword(encodePassword);
        return userMapper.toDto(userRepository.save(user));
    }

    public LoginResponseDto login(String userName, String password) {

        try {
            Authentication auth = authenticationManager.authenticate
                    (new UsernamePasswordAuthenticationToken(userName, password));
            String token = tokenService.generateJwt(auth);
            User user = (User) auth.getPrincipal();
            return new LoginResponseDto(userRepository.findByUserName(userName).get(), token);

        } catch (AuthenticationException exception) {
            return new LoginResponseDto(Optional.ofNullable(null), "");
        }
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
        userMapper.update(userDto, user);
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
