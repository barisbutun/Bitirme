package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.repository.TemproraryUserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TemproraryUserService {

    private final TemproraryUserRepository temproraryUserRepository;


    @Scheduled(fixedRate = 60000)
    public void cleanExpiredTemproraryUsers() {
        LocalDateTime now = LocalDateTime.now();
        temproraryUserRepository.findAll().stream()
                .filter(user -> !user.isVerified() && user.getCodeGeneratedAt().plusMinutes(5).isBefore(now))
                .forEach(user -> {
                    temproraryUserRepository.delete(user);
                });


    }

}
