package com.example.surveillance.Enseignant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {


   @Query("SELECT e FROM Enseignant e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
   List<Enseignant> findByNameContainingIgnoreCase(@Param("keyword") String keyword);

   Optional<Enseignant> findByEmail(String email);
}
