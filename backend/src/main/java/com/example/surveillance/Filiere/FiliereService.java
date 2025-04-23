package com.example.surveillance.Filiere;

import java.util.List;

public interface FiliereService {
    List<Filiere> getFilieres();
    Filiere getFiliereById(Long id);
    void addFiliere(Filiere filiere);
    boolean updateFiliere( Long id,Filiere filiere);
    boolean deleteFiliere(Long id);
}
