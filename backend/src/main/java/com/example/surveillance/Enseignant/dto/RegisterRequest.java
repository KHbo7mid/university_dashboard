package com.example.surveillance.Enseignant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;

    private String department;
    private String grade;

    // Teaching hours attributes
    private BigDecimal heuresCours = BigDecimal.ZERO;
    private BigDecimal heuresTd = BigDecimal.ZERO;
    private BigDecimal heuresTp = BigDecimal.ZERO;
    private BigDecimal coeff = BigDecimal.ONE;
}
