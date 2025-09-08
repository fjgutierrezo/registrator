package com.TMF.registrator.controller;

import com.TMF.registrator.dto.JefeAprobarPaqueteRequest;
import com.TMF.registrator.service.JefeObraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/jefeobra")
public class JefeObraController {

    private final JefeObraService service;

    public JefeObraController(JefeObraService service) {
        this.service = service;
    }

    // Lista días -> frentes -> trabajadores (solo jornadas Aprobado-Capataz) del mes en curso
    @GetMapping("/pendientes")
    public ResponseEntity<?> pendientes() {
        return ResponseEntity.ok(service.listarPendientesMesActual());
    }

    // Aprueba en bloque todas las jornadas de un frente en una fecha
    @PutMapping("/aprobar/{fecha}/{frenteId}")
    public ResponseEntity<?> aprobarPaquete(@PathVariable String fecha, @PathVariable Long frenteId) {
        int count = service.aprobarPaquete(LocalDate.parse(fecha), frenteId);
        return ResponseEntity.ok(Map.of("ok", true, "aprobadas", count));
    }
}
