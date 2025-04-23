package com.example.surveillance.Salle;

import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salles")
@AllArgsConstructor
public class SalleController {
    private final SalleService salleService;
    @GetMapping
    public ResponseEntity<List<Salle>> getAllSalles() {
        return ResponseEntity.ok(salleService.getAllSalles());
    }
    @PostMapping
    public ResponseEntity<String> addSalle(@RequestBody Salle salle) {
        boolean isAdded = salleService.saveSalle(salle);
        return isAdded
                ? new ResponseEntity<>("Salle created successfully", HttpStatus.CREATED)
                : new ResponseEntity<>("Salle already exists", HttpStatus.CONFLICT);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Salle> getSalleById(@PathVariable long id) {
        return ResponseEntity.ok(salleService.getSalleById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateSalle(@PathVariable long id, @RequestBody Salle salle) {
       salleService.updateSalle(id, salle);
       return ResponseEntity.ok("Salle updated successfully");
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSalle(@PathVariable long id) {
        salleService.deleteSalle(id);
        return ResponseEntity.ok("Salle deleted successfully");
    }
    @GetMapping("/disponible")
    public ResponseEntity<List<Salle>> getSalleByDisponible() {
        return  ResponseEntity.ok(salleService.getSallesDisponible());
    }
}
