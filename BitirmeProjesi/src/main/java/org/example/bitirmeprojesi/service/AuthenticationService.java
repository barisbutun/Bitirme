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

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public UserDto register(RegisterDto registerDto) {
        String encodedPassword = passwordEncoder.encode(registerDto.getPassword());
        User user = userMapper.toEntity(registerDto);
        user.setRole(Role.USER);
        user.setPassword(encodedPassword);
        return userMapper.toDto(userRepository.save(user));
    }

    public boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        try {
            var auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));

            User user = (User) auth.getPrincipal();
            String token = tokenService.generateJwt(auth);

            if (isAdmin(user)) {
                return new LoginResponseDto(token);
            }

            return new LoginResponseDto(token);

        } catch (AuthenticationException exception) {
            throw new BadCredentialsException("Invalid email or password", exception);
        }
    }
}
