package com.example.surveillance.Filiere.Imp;

import com.example.surveillance.Exceptions.ResourceNotFoundException;
import com.example.surveillance.Filiere.Filiere;
import com.example.surveillance.Filiere.FiliereRepository;
import com.example.surveillance.Filiere.FiliereService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FiliereServiceImp implements FiliereService {
    private final FiliereRepository filiereRepository;
    @Override
    public List<Filiere> getFilieres() {
        return filiereRepository.findAll();
    }

    @Override
    public Filiere getFiliereById(Long id) {
        Filiere filiere = filiereRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Filiere not found"));

        return filiere;
    }

    @Override
    public void addFiliere(Filiere filiere) {
        filiereRepository.save(filiere);

    }

    @Override
    public boolean updateFiliere(Long id, Filiere updatedFiliere) {
        Filiere filiere=filiereRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Filiere not found"));
        filiere.setNom(updatedFiliere.getNom());
        filiere.setType(updatedFiliere.getType());
        filiere.setType(updatedFiliere.getType());
        filiere.setNbr_students(updatedFiliere.getNbr_students());
        filiereRepository.save(filiere);
        return true;
    }

    @Override
    public boolean deleteFiliere(Long id) {
        Filiere filiere=filiereRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Filiere not found"));
        filiereRepository.delete(filiere);
        return true;
    }
}
