package com.example.surveillance.User;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String mail);

    boolean existsByEmail(String email);
}
