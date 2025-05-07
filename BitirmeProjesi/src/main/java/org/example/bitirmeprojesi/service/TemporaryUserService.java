package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.repository.TemproraryUserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TemporaryUserService {

    private final TemproraryUserRepository temproraryUserRepository;


    @Scheduled(fixedRate = 60000)
    public void cleanExpiredTemproraryUsers() {
        LocalDateTime now = LocalDateTime.now();
        temproraryUserRepository.findAll().stream()
                .filter(user ->  user.getCodeGeneratedAt().plusMinutes(6).isBefore(now))
                .forEach(user -> {
                    temproraryUserRepository.delete(user);
                });


    }

}
