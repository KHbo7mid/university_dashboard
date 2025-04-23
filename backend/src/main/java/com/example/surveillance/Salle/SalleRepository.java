package com.example.surveillance.Salle;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalleRepository extends JpaRepository<Salle, Long> {
    Optional<Salle> findByNumberAndBloc(int number, String bloc);
    List<Salle> findByDisponibleTrue();
}
