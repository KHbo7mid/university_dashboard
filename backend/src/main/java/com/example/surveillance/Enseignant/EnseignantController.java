package com.example.surveillance.Enseignant;

import com.example.surveillance.Auth.AuthService;
import com.example.surveillance.Enseignant.dto.RegisterRequest;
import com.example.surveillance.Enseignant.dto.UnavailabilityRequest;
import com.example.surveillance.Exceptions.EmailAlreadyExistsException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/enseignants")
@AllArgsConstructor
public class EnseignantController {
    private final EnseignantServices enseignantServices;
    private final AuthService authService;
    @GetMapping
    public ResponseEntity<List<Enseignant>> getEnseignants() {
        return ResponseEntity.ok(enseignantServices.getAllEnseignants());
    }
    @PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody RegisterRequest request) {
        try {
            Enseignant t = authService.registerTeacher(request);
            return ResponseEntity.ok("Teacher registered: " + t.getEmail());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        } catch (EmailAlreadyExistsException e) {
            throw new RuntimeException(e);
        }
    }
  @GetMapping("/{id}")
    public ResponseEntity<Enseignant> getEnseignant(@PathVariable Long id) {
      Enseignant enseignant = enseignantServices.getEnseignantById(id);
      return ResponseEntity.ok(enseignant);
  }
  @PutMapping("/{id}")
    public ResponseEntity<String> updateEnseignant(@PathVariable Long id, @RequestBody Enseignant enseignant) {
      enseignantServices.updateEnseignant(id, enseignant);
      return ResponseEntity.ok("Enseignant updated successfully");
  }
  @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnseignant(@PathVariable Long id) {
      enseignantServices.deleteEnseignant(id);
      return ResponseEntity.ok("Enseignant deleted successfully");
  }

  @PostMapping("/{id}/unavailable-slots")
    public ResponseEntity<String> addUnavailableSlot(@PathVariable Long id, @RequestBody UnavailabilityRequest request) {
        enseignantServices.addUnavailableSlots(id,request);
        return ResponseEntity.ok("Unavailable slots added successfully");
  }
}
