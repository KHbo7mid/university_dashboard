package com.example.surveillance.Examen;

import java.util.List;

public interface ExamenService {
    List<Examen> getAllExams();
    Examen getExamenById(Long id);
    void saveExamen(Examen examen);
    boolean updateExamen(Long id,Examen examen);
    boolean deleteExamen(Long id);
    void deleteAllExams();
}
