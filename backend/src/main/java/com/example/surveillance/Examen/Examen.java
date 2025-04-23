package com.example.surveillance.Examen;

import com.example.surveillance.Enseignant.Enseignant;
import com.example.surveillance.Filiere.Filiere;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Entity
@Getter@Setter@AllArgsConstructor@NoArgsConstructor
public class Examen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String date;
    private String start_time;
    private String end_time;

    @ManyToOne
    private Filiere filiere;
    @ManyToOne

    private Enseignant enseignant_responsable;

}
