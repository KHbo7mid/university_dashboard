package com.example.surveillance.Examen;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin/examens")
public class ExamenController {
    private ExamenService examenService;
    @GetMapping
    public ResponseEntity<List<Examen>> getAll() {
        return ResponseEntity.ok(examenService.getAllExams());
    }
    @PostMapping
    public ResponseEntity<String> create(@RequestBody Examen examen) {
        examenService.saveExamen(examen);
        return ResponseEntity.ok("Examen created");
    }
    @GetMapping("/{id}")
    public ResponseEntity<Examen> getExamenById(@PathVariable Long id) {
        return ResponseEntity.ok(examenService.getExamenById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody Examen examen) {
        examenService.updateExamen(id, examen);
        return ResponseEntity.ok("Examen updated");
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        examenService.deleteExamen(id);
        return ResponseEntity.ok("Examen deleted");
    }
    @DeleteMapping("/all")
    public ResponseEntity<String> deleteAll() {
        examenService.deleteAllExams();
        return ResponseEntity.ok("All exams deleted");
    }

}
