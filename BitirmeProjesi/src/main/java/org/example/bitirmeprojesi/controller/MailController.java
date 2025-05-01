package org.example.bitirmeprojesi.controller;


import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.TemporaryUserDto;
import org.example.bitirmeprojesi.service.MailService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;


    @PostMapping("/v1/send-verification")
    public String sendVerification( @RequestBody TemporaryUserDto TemporaryUserDto) throws MessagingException {
        mailService.sendEmailVerification(TemporaryUserDto);
        return "Doğrulama kodu e-posta adresinize gönderildi!";
    }


}
