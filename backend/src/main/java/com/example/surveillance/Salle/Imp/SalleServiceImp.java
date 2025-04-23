package com.example.surveillance.Salle.Imp;

import com.example.surveillance.Exceptions.ResourceNotFoundException;
import com.example.surveillance.Salle.Salle;
import com.example.surveillance.Salle.SalleRepository;
import com.example.surveillance.Salle.SalleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class SalleServiceImp implements SalleService {
    private final SalleRepository salleRepository;

    public SalleServiceImp(SalleRepository salleRepository) {
        this.salleRepository = salleRepository;
    }

    @Override
    public List<Salle> getAllSalles() {
        return salleRepository.findAll();
    }

    @Override
    public Salle getSalleById(Long id) {
        return salleRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Salle not found"));
    }

    @Override
    public boolean saveSalle(Salle salle) {
        Optional<Salle> salle1=salleRepository.findByNumberAndBloc(salle.getNumber(),salle.getBloc());
        if(salle1.isEmpty()) {
            salleRepository.save(salle);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateSalle(Long id,Salle updatedSalle) {
        Salle salle=salleRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Salle not found"));
        salle.setNumber(updatedSalle.getNumber());
        salle.setBloc(updatedSalle.getBloc());
        salle.setDisponible(updatedSalle.isDisponible());
        salleRepository.save(salle);
        return true;
    }

    @Override
    public boolean deleteSalle(Long id) {
        Salle salle=salleRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Salle not found"));
        salleRepository.delete(salle);
        return true;
    }

    @Override
    public List<Salle> getSallesDisponible() {
        return salleRepository.findByDisponibleTrue();
    }
}
