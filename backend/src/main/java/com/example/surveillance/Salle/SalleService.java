package com.example.surveillance.Salle;

import java.util.List;

public interface SalleService {
    List<Salle> getAllSalles();
    Salle getSalleById(Long id);
    boolean saveSalle(Salle salle);
    boolean updateSalle(Long id,Salle salle);
    boolean deleteSalle(Long id);
    List<Salle> getSallesDisponible();
}
