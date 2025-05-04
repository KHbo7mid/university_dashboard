package com.example.surveillance.User;

import com.example.surveillance.Enseignant.EnseignantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@issatso.tn").isEmpty()) {
            Admin admin = new Admin();
            admin.setEmail("admin@issatso.tn");
            admin.setPassword(encoder.encode("admin123"));
            admin.setFirstLogin(false);
            userRepository.save(admin);
            System.out.println("Admin created with encoded password: " + admin.getPassword());
        }
    }
}