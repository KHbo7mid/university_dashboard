package com.example.surveillance.Enseignant;

import com.example.surveillance.Examen.Examen;
import com.example.surveillance.User.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@DiscriminatorValue("TEACHER")
public class Enseignant extends User {

    private String name;
    private String department;

    private String grade;
    @Column(precision = 5, scale = 3)
    private BigDecimal heures_cours= BigDecimal.ZERO;
    @Column(precision = 5, scale = 3)
    private BigDecimal heures_td= BigDecimal.ZERO;
    @Column(precision = 5, scale = 3)
    private BigDecimal heures_tp= BigDecimal.ZERO;
    @Column(precision = 5, scale = 2)
    private BigDecimal coeff= BigDecimal.ONE;

    @OneToMany(mappedBy = "enseignant_responsable",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Examen> examens;
@OneToMany(mappedBy = "enseignant",cascade = CascadeType.ALL, orphanRemoval = true)
@OrderBy("date ASC ,startTime ASC ")

   private List<UnavailableSlot> unavailableSlots;




    public int getHeuresSurveillance() {
        BigDecimal safeCoeff = coeff != null ? coeff : BigDecimal.ONE;
        BigDecimal safeCours = heures_cours != null ? heures_cours : BigDecimal.ZERO;
        BigDecimal safeTD = heures_td != null ? heures_td : BigDecimal.ZERO;
        BigDecimal safeTP = heures_tp != null ? heures_tp : BigDecimal.ZERO;

        BigDecimal total = safeCours
                .add(safeTD)
                .add(safeTP.multiply(new BigDecimal("0.75")));

        return safeCoeff.multiply(total).setScale(0, RoundingMode.HALF_UP).intValue();
    }


}
