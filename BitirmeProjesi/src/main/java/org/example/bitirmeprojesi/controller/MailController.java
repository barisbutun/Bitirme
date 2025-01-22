package org.example.bitirmeprojesi.controller;


import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.TemproraryUserDto;
import org.example.bitirmeprojesi.service.MailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;


    @PostMapping("/v1/send-verification")
    public String sendVerification( @RequestBody TemproraryUserDto TemproraryUserDto) {
        mailService.sendEmailVerification(TemproraryUserDto);
        return "Doğrulama kodu e-posta adresinize gönderildi!";
    }


}
