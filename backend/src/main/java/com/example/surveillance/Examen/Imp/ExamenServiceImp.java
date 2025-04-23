package com.example.surveillance.Examen.Imp;

import com.example.surveillance.Examen.Examen;
import com.example.surveillance.Examen.ExamenRepository;
import com.example.surveillance.Examen.ExamenService;
import com.example.surveillance.Exceptions.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExamenServiceImp implements ExamenService {
    private final ExamenRepository examenRepository;
    @Override
    public List<Examen> getAllExams() {
        return examenRepository.findAll();
    }

    @Override
    public Examen getExamenById(Long id) {
        return examenRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Examen not found"));
    }

    @Override
    public void saveExamen(Examen examen) {
      examenRepository.save(examen);
    }

    @Override
    public boolean updateExamen(Long id, Examen updatedExamen) {
        Examen examen = examenRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Examen not found"));
        examen.setNom(updatedExamen.getNom());
        examen.setDate(updatedExamen.getDate());
        examen.setFiliere(updatedExamen.getFiliere());
        examen.setStart_time(updatedExamen.getStart_time());
        examen.setEnd_time(updatedExamen.getEnd_time());
        examen.setEnseignant_responsable(updatedExamen.getEnseignant_responsable());
        examenRepository.save(examen);
        return true;
    }

    @Override
    public boolean deleteExamen(Long id) {
        Examen examen = examenRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Examen not found"));
        examenRepository.delete(examen);
        return true;
    }

    @Override
    public void deleteAllExams() {
        examenRepository.deleteAll();

    }
}
