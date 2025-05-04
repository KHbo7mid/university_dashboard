package com.example.surveillance.Filiere;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/filieres")
@AllArgsConstructor
public class FiliereController {
    private final FiliereService filiereService;
    @GetMapping
    public ResponseEntity<List<Filiere>> getFilieres() {
        return ResponseEntity.ok(filiereService.getFilieres());
    }
    @PostMapping
    public ResponseEntity<String> addFiliere(@RequestBody Filiere filiere) {
       filiereService.addFiliere(filiere);
       return ResponseEntity.ok("Filiere added");
    }
    @GetMapping("/{id}")
    public ResponseEntity<Filiere> getFiliereById(@PathVariable Long id) {
        return ResponseEntity.ok(filiereService.getFiliereById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateFiliere(@PathVariable Long id, @RequestBody Filiere filiere) {
       filiereService.updateFiliere(id, filiere);
       return ResponseEntity.ok("Filiere updated");

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFiliere(@PathVariable Long id) {
        filiereService.deleteFiliere(id);
        return ResponseEntity.ok("Filiere deleted");
    }
}
