package com.example.surveillance.Auth;

import com.example.surveillance.EmailService;
import com.example.surveillance.Enseignant.Enseignant;
import com.example.surveillance.Enseignant.EnseignantRepository;
import com.example.surveillance.Enseignant.dto.RegisterRequest;
import com.example.surveillance.Exceptions.EmailAlreadyExistsException;
import com.example.surveillance.User.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
@Service
@RequiredArgsConstructor
public class AuthService {
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    public String generateRandomPassword() {
        /*String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(12);

        for (int i = 0; i < 12; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        */


        return "teacher123";
    }

    @Transactional
    public Enseignant registerTeacher(RegisterRequest request) throws EmailAlreadyExistsException {
        if (repository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        String tempPassword = generateRandomPassword();

        Enseignant teacher = new Enseignant();
        teacher.setEmail(request.getEmail());
        teacher.setPassword(passwordEncoder.encode(tempPassword));
        teacher.setDepartment(request.getDepartment());
        teacher.setGrade(request.getGrade());
        teacher.setName(request.getName());
        teacher.setFirstLogin(true);
        teacher.setHeures_cours(request.getHeuresCours());
        teacher.setHeures_td(request.getHeuresTd());
        teacher.setHeures_tp(request.getHeuresTp());
        teacher.setCoeff(request.getCoeff());

        Enseignant savedTeacher = repository.save(teacher);
        try {
            emailService.sendTeacherCredentials(request.getEmail(), request.getName(), tempPassword);
        } catch (Exception e) {

            System.err.println("Failed to send email: " + e.getMessage());

        }

        return savedTeacher;
    }




    public void changePassword(Enseignant teacher, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, teacher.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        teacher.setPassword(passwordEncoder.encode(newPassword));
        teacher.setFirstLogin(false);
        repository.save(teacher);
    }
}
