package com.TMF.registrator.controller;

import com.TMF.registrator.dto.*;
import com.TMF.registrator.service.CapatazService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/capataz")
public class CapatazController {

    private final CapatazService service;

    public CapatazController(CapatazService service) {
        this.service = service;
    }

    // Pendientes de validar (mes en curso), agrupados por fecha
    @GetMapping("/jornadas/pendientes")
    public ResponseEntity<?> pendientes() {
        return ResponseEntity.ok(service.listarPendientesMesActual());
    }

    // Validadas (mes en curso), agrupadas por fecha
    @GetMapping("/jornadas/validadas")
    public ResponseEntity<?> validadas() {
        return ResponseEntity.ok(service.listarValidadasMesActual());
    }

    // Validar jornada (con ediciones opcionales)
    @PutMapping("/jornadas/{id}/validar")
    public ResponseEntity<?> validar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        service.validarJornada(id, body.get("horaEntradaEditadaISO"), body.get("horaSalidaEditadaISO"), body.get("motivoEdicion"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // Quitar validación (vuelve a EN_APROBACION)
    @PutMapping("/jornadas/{id}/quitarValidacion")
    public ResponseEntity<?> quitar(@PathVariable Long id) {
        service.quitarValidacion(id);
        return ResponseEntity.ok(java.util.Map.of("ok", true));
    }

}
