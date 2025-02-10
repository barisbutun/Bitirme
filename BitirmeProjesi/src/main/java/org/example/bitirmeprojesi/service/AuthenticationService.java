package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.*;
import org.example.bitirmeprojesi.entity.TemproraryUser;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.enums.Role;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.AccountNotFoundException;
import org.example.bitirmeprojesi.exception.error.InvalidVerificationCodeException;
import org.example.bitirmeprojesi.mapper.UserMapper;
import org.example.bitirmeprojesi.repository.TemproraryUserRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.util.PasswordGenerator;
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
    private final TemproraryUserRepository temproraryUserRepository;
    private final MailService mailService;

    public void verifyUser(VerifyUserDto verifyUserDto) throws InvalidVerificationCodeException {

        TemproraryUser tempUser = temproraryUserRepository.findByEmailAndCode(verifyUserDto.getEmail(), verifyUserDto.getCode());

        if (tempUser == null) {
            throw new InvalidVerificationCodeException(ErrorMesage.INVALID_VERIFICATION_CODE);
        }

        if (!tempUser.isVerified()) {
            tempUser.setVerified(true);
            temproraryUserRepository.save(tempUser);

            User user = new User();
            user.setEmail(tempUser.getEmail());
            String temproraryPassword=PasswordGenerator.generateRandomPassword();
            mailService.temproraryPassword(verifyUserDto.getEmail(), temproraryPassword);
            user.setPassword(passwordEncoder.encode(temproraryPassword));
            user.setRegistered(true);
            userRepository.save(user);


        }
    }
    public void resetPassword(UserResetPasswordDto userResetPasswordDto){


        User user=userRepository.findByEmail(userResetPasswordDto.getEmail()).orElseThrow(() -> new AccountNotFoundException(ErrorMesage.ACCOUNT_NOT_FOUND_ERROR));
        String newPassword = PasswordGenerator.generateRandomPassword();
        mailService.sendResetPasswordEmail(userResetPasswordDto.getEmail(),newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

    }


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
