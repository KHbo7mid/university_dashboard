package com.example.surveillance.Auth;

import com.example.surveillance.Enseignant.Enseignant;
import com.example.surveillance.Enseignant.EnseignantRepository;
import com.example.surveillance.Enseignant.dto.ChangePasswordRequest;
import com.example.surveillance.Enseignant.dto.LoginRequest;
import com.example.surveillance.Enseignant.dto.RegisterRequest;
import com.example.surveillance.Exceptions.EmailAlreadyExistsException;
import com.example.surveillance.User.Admin;
import com.example.surveillance.User.User;
import com.example.surveillance.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository repository;

    @PostMapping("/register")
    public ResponseEntity<String> registerTeacher(@RequestBody RegisterRequest request) {
        try {
            authService.registerTeacher(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Teacher registered successfully. Credentials sent via email.");
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = repository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            String role = (user instanceof Admin) ? "ADMIN" : "TEACHER";

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "role", role,
                    "user", user,
                    "firstLogin", user.isFirstLogin()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal Enseignant teacher
    ) {
        try {
            authService.changePassword(
                    teacher,
                    request.getCurrentPassword(),
                    request.getNewPassword()
            );
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}