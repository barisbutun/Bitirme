package org.example.bitirmeprojesi.service;

import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.TemproraryUserDto;
import org.example.bitirmeprojesi.entity.TemproraryUser;
import org.example.bitirmeprojesi.mapper.TempororaryUserMapper;
import org.example.bitirmeprojesi.repository.TemproraryUserRepository;
import org.example.bitirmeprojesi.util.VerificationCodeGenerator;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final TemproraryUserRepository temproraryUserRepository;
    private final TempororaryUserMapper tempororaryUserMapper;

    public void temproraryPassword(String email,String newPassword) {
        String to = email;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        String text=createEmailTextTemproraryPassword(newPassword);
        String subject = createEmailSubjectTemproraryPassword();
        message.setTo(to);
        message.setText(text);
        message.setSubject(subject);
        mailSender.send(message);

    }


    public void sendResetPasswordEmail(String email,String newPassword) {
        String to = email;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        String text=createEmailTextResetPassword(newPassword);
        String subject = createEmailSubjectResetPassword();
        message.setTo(to);
        message.setText(text);
        message.setSubject(subject);
        mailSender.send(message);

    }


    public void sendEmailVerification(TemproraryUserDto temproraryUserDto) {
        TemproraryUser temproraryUser = tempororaryUserMapper.toEntity(temproraryUserDto);
        String to = temproraryUserDto.getEmail();
        String code = VerificationCodeGenerator.generateCode();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);


        String text = createEmailTextVerification(code);
        String subject = createEmailSubjectVerification();

        message.setText(text);
        message.setSubject(subject);
        temproraryUser.setCode(code);
        temproraryUserRepository.save(temproraryUser);


        mailSender.send(message);
    }
    private String createEmailTextTemproraryPassword(String newPassword) {
        return "Merhaba,\n\nGeçiçi şifreniz "+newPassword+"\n\nDeğiştirmeyi unutmayınız.";
    }

    private String createEmailTextVerification(String code) {
        return "Merhaba,\n\nDoğrulama kodunuz: " + code + "\n\nBu kodu kimseyle paylaşmayın.";
    }

    private String createEmailSubjectTemproraryPassword() {
        return "Geçici Şifreniz";
    }

    private String createEmailTextResetPassword(String newPassword) {
        return "Merhaba,\n\nSıfırlama kodunuz: "+newPassword+"\n\nBu kodu kimseyle paylaşmayın.";
    }

    private String createEmailSubjectResetPassword() {
        return "Sıfırlama kodunuz";
    }


    private String createEmailSubjectVerification() {
        return "E-posta doğrulama kodunuz";
    }
}
