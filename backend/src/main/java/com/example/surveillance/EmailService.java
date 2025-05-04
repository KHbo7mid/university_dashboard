package com.example.surveillance;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final Environment env;

    public void sendTeacherCredentials(String toEmail, String name, String password) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(env.getProperty("spring.mail.username"));
            helper.setTo(toEmail);
            helper.setSubject("Your Account Credentials");

            String htmlContent = buildEmailContent(name, password);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String buildEmailContent(String name, String password) {
        return "<!DOCTYPE html>" +
                "<html><body>" +
                "<h2>Welcome, " + name + "!</h2>" +
                "<p>Your account has been created.</p>" +
                "<p><strong>Temporary Password:</strong> " + password + "</p>" +
                "<p>Please change your password after first login.</p>" +
                "</body></html>";
    }
}
