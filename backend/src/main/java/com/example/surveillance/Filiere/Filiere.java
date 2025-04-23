package com.example.surveillance.Filiere;

import com.example.surveillance.Examen.Examen;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter@Setter@AllArgsConstructor@NoArgsConstructor
public class Filiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String type;
    private String niveau;
    private int nbr_students;
    @OneToMany(mappedBy = "filiere",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Examen> examens;
}
