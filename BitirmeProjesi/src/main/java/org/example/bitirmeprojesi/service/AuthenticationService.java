package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.LoginRequestDto;
import org.example.bitirmeprojesi.dto.LoginResponseDto;
import org.example.bitirmeprojesi.dto.RegisterDto;
import org.example.bitirmeprojesi.dto.UserDto;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.enums.Role;
import org.example.bitirmeprojesi.mapper.UserMapper;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;

    private final  PasswordEncoder passwordEncoder;

    private final TokenService tokenService;

    private final AuthenticationManager authenticationManager;

    private  final UserMapper userMapper;

    private final AdminService adminService;
    public UserDto register(RegisterDto registerDto) {

        String encodePassword = passwordEncoder.encode(registerDto.getPassword());
        User user = userMapper.toEntity(registerDto);
        user.setRole(Role.USER);
        user.setPassword(encodePassword);
        return userMapper.toDto(userRepository.save(user));
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        try {
            var auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));
            if(adminService.isAdmin(loginRequestDto.getEmail(), loginRequestDto.getPassword())) {
                String adminToken = tokenService.generateJwt(auth);

                return new LoginResponseDto(Optional.ofNullable(null), adminToken);
            }

            String token = tokenService.generateJwt(auth);
            User user = (User) auth.getPrincipal();

            return new LoginResponseDto(user, token);


        } catch (AuthenticationException exception) {
            throw new BadCredentialsException("Invalid email or password", exception);
        }
    }
}
