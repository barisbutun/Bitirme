package org.example.bitirmeprojesi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.example.bitirmeprojesi.dto.TemproraryUserDto;
import org.example.bitirmeprojesi.entity.TemproraryUser;
import org.example.bitirmeprojesi.exception.ErrorMesage;
import org.example.bitirmeprojesi.exception.error.ExistByEmailException;
import org.example.bitirmeprojesi.mapper.TempororaryUserMapper;
import org.example.bitirmeprojesi.repository.TemproraryUserRepository;
import org.example.bitirmeprojesi.repository.UserRepository;
import org.example.bitirmeprojesi.util.VerificationCodeGenerator;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final TemproraryUserRepository temproraryUserRepository;
    private final TempororaryUserMapper tempororaryUserMapper;
    private final UserRepository userRepository;

    public void temproraryPassword(String email, String newPassword) {
        EmailContent content = new EmailContent(
                "Geçici Şifreniz",
                "Geçici Şifreniz aşağıdadır. Lütfen en kısa sürede değiştiriniz.",
                "Geçici şifrenizi kimseyle paylaşmayınız.",
                "Geçici Şifreniz"
        );

        sendHtmlEmail(email, newPassword, content);
    }

    public void sendResetPasswordEmail(String email, String newPassword) {
        EmailContent content = new EmailContent(
                "Yeni Şifreniz",
                "Şifrenizi sıfırlamak için aşağıdaki kodu kullanabilirsiniz.",
                "Yeni şifrenizi kimseyle paylaşmayınız.",
                "Yeni Şifreniz"
        );

        sendHtmlEmail(email, newPassword, content);
    }

    public void sendEmailVerification(TemproraryUserDto dto) throws MessagingException {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ExistByEmailException(ErrorMesage.EXIST_BY_EMAIL_ERROR);
        }

        if(temproraryUserRepository.existsByEmail(dto.getEmail())){

            TemproraryUser temproraryUser=temproraryUserRepository.findByEmail(dto.getEmail());
            temproraryUser.setCode(VerificationCodeGenerator.generateCode());
            temproraryUserRepository.save(temproraryUser);
        }



        String code = VerificationCodeGenerator.generateCode();

        TemproraryUser user = tempororaryUserMapper.toEntity(dto);
        user.setCode(code);
        temproraryUserRepository.save(user);

        EmailContent content = new EmailContent(
                "Hesap Doğrulama - Fashion Design",
                "E-posta adresinizi doğrulamak için aşağıdaki kodu kullanın.",
                "Bu doğrulama kodu 6 dakika için geçerlidir.",
                "Hesabınızı Doğrulayın"
        );

        sendHtmlEmail(dto.getEmail(), code, content);
    }

    private void sendHtmlEmail(String email, String code, EmailContent content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String html = loadHtmlTemplateWithContent(code, content);

            helper.setTo(email);
            helper.setSubject(content.subject());
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("E-posta gönderilemedi", e);
        }
    }

    private String loadHtmlTemplateWithContent(String code, EmailContent content) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/verification-email.html");
            String html = Files.readString(resource.getFile().toPath());

            html = html.replace("{{code}}", code);
            html = html.replace("{{sentence}}", content.sentence());
            html = html.replace("{{sentence2}}", content.sentence2());
            html = html.replace("{{header}}", content.header());

            return html;
        } catch (IOException e) {
            throw new RuntimeException("HTML şablonu yüklenemedi", e);
        }
    }


    private record EmailContent(
            String subject,
            String sentence,
            String sentence2,
            String header
    ) {}
}
