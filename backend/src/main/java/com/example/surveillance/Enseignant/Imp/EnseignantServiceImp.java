package com.example.surveillance.Enseignant.Imp;

import com.example.surveillance.Enseignant.*;
import com.example.surveillance.Enseignant.dto.UnavailabilityRequest;
import com.example.surveillance.Exceptions.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class EnseignantServiceImp  implements EnseignantServices {
    private final EnseignantRepository enseignantRepository;
    private final PasswordEncoder passwordEncoder;
    public EnseignantServiceImp(EnseignantRepository enseignantRepository, PasswordEncoder passwordEncoder) {
        this.enseignantRepository = enseignantRepository;
        this.passwordEncoder = passwordEncoder;
    }



    @Override
    public List<Enseignant> getAllEnseignants() {
        return enseignantRepository.findAll();
    }

    @Override
    public Enseignant getEnseignantById(Long id) {
        return enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant not found with id: " + id));
    }

    @Override
    public boolean updateEnseignant(Long id, Enseignant updatedEnseignant) {
        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant not found with id: " + id));

            enseignant.setName(updatedEnseignant.getName());
            enseignant.setDepartment(updatedEnseignant.getDepartment());
            enseignant.setGrade(updatedEnseignant.getGrade());
            enseignant.setEmail(updatedEnseignant.getEmail());
            enseignant.setHeures_cours(updatedEnseignant.getHeures_cours());
            enseignant.setHeures_td(updatedEnseignant.getHeures_td());
            enseignant.setHeures_tp(updatedEnseignant.getHeures_tp());
            enseignant.setCoeff(updatedEnseignant.getCoeff());

            enseignantRepository.save(enseignant);
            return true;

    }

    @Override
    public boolean deleteEnseignant(Long id) {
        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant not found with id: " + id));

        enseignantRepository.delete(enseignant);
        return true;

    }



    @Override
    public void addUnavailableSlots(Long id, UnavailabilityRequest request) {
        Enseignant teacher=enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant not found with id: " + id));
        // Add new slots
        request.getSlots().forEach(slot -> {
            UnavailableSlot newSlot = new UnavailableSlot();
            newSlot.setDate(request.getDate());
            newSlot.setStartTime(slot.getStartTime());
            newSlot.setEndTime(slot.getEndTime());

            newSlot.setEnseignant(teacher);
            teacher.getUnavailableSlots().add(newSlot);
        });
        enseignantRepository.save(teacher);
    }

    @Override
    public boolean saveEnseignantWithPassword(Enseignant enseignant, String password) {
        if (enseignantRepository.existsByEmail(enseignant.getEmail())) {
            return false;
        }

        enseignant.setPassword(passwordEncoder.encode(password));
        enseignant.setFirstLogin(true);
        enseignantRepository.save(enseignant);
        return true;
    }
}
