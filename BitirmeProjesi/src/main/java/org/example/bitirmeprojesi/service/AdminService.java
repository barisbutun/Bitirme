package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.entity.User;
import org.example.bitirmeprojesi.enums.Role;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private static final String ADMIN_EMAIL = "f211220005@ktun.edu.tr";
    private static final String ADMIN_PASSWORD = "1234";
    private final PasswordEncoder passwordEncoder;

    public boolean isAdmin(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (passwordEncoder.matches(password, user.getPassword()) && user.getRole() == Role.ADMIN) {
            return true;
        }
        return false;
    }

}
