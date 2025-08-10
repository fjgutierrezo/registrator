package com.TMF.registrator.controller;

import com.TMF.registrator.dto.TrabajadorEnFrenteRequest;
import com.TMF.registrator.model.TrabajadorEnFrente;
import com.TMF.registrator.service.TrabajadorEnFrenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/trabajadorEnFrente")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TrabajadorEnFrenteController {

    private final TrabajadorEnFrenteService service;

    public TrabajadorEnFrenteController(TrabajadorEnFrenteService service) {
        this.service = service;
    }

    @GetMapping("/listarPorFrente/{frenteTrabajoId}")
    public ResponseEntity<List<TrabajadorEnFrente>> listarPorFrente(@PathVariable Long frenteTrabajoId) {
        List<TrabajadorEnFrente> lista = service.listarPorFrente(frenteTrabajoId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/listarPorCedula/{cedula}")
    public ResponseEntity<List<TrabajadorEnFrente>> listarPorCedula(@PathVariable String cedula) {
        List<TrabajadorEnFrente> lista = service.listarPorCedula(cedula);
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody TrabajadorEnFrenteRequest request) {
        try {
            TrabajadorEnFrente creado = service.guardarDesdeRequest(request);
            return ResponseEntity.ok(creado);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor");
        }
    }



    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        service.eliminarPorId(id);
        return ResponseEntity.ok("TrabajadorEnFrente eliminado correctamente");
    }
}
