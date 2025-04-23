package com.example.surveillance.Enseignant;

import com.example.surveillance.Enseignant.dto.UnavailabilityRequest;

import java.util.List;

public interface EnseignantServices {
    boolean saveEnseignant(Enseignant enseignant);
    List<Enseignant> getAllEnseignants();
    Enseignant getEnseignantById(Long id);
    boolean updateEnseignant(Long id, Enseignant enseignant);
    boolean deleteEnseignant(Long id);

    void addUnavailableSlots(Long id, UnavailabilityRequest request);

}
