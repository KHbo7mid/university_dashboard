package com.example.surveillance.Enseignant;

import com.example.surveillance.Enseignant.dto.UnavailabilityRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enseignants")
@AllArgsConstructor
public class EnseignantController {
    private final EnseignantServices enseignantServices;
    @GetMapping
    public ResponseEntity<List<Enseignant>> getEnseignants() {
        return ResponseEntity.ok(enseignantServices.getAllEnseignants());
    }
    @PostMapping
    public ResponseEntity<String> addEnseignant(@RequestBody Enseignant enseignant) {
        boolean isAdded = enseignantServices.saveEnseignant(enseignant);
        return isAdded
                ? new ResponseEntity<>("Enseignant created successfully", HttpStatus.CREATED)
                : new ResponseEntity<>("Enseignant already exists", HttpStatus.CONFLICT);

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
