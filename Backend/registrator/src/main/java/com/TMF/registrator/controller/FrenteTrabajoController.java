package com.TMF.registrator.controller;

import com.TMF.registrator.dto.FrenteTrabajoRequest;
import com.TMF.registrator.model.FrenteTrabajo;
import com.TMF.registrator.service.FrenteTrabajoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/frentes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FrenteTrabajoController {

    private final FrenteTrabajoService service;

    public FrenteTrabajoController(FrenteTrabajoService service) {
        this.service = service;
    }

    @PostMapping("/crear")
    public ResponseEntity<FrenteTrabajo> crearFrente(@RequestBody FrenteTrabajoRequest request) {
        FrenteTrabajo creado = service.crearFrente(request);
        return ResponseEntity.ok(creado);
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<FrenteTrabajo> finalizarFrente(@PathVariable Long id) {
        FrenteTrabajo finalizado = service.finalizarFrente(id);
        return ResponseEntity.ok(finalizado);
    }

    @PutMapping("/{id}/apagar")
    public ResponseEntity<FrenteTrabajo> apagarFrente(@PathVariable Long id) {
        FrenteTrabajo apagado = service.apagarFrente(id);
        return ResponseEntity.ok(apagado);
    }
    @GetMapping("/listarActivos")
    public ResponseEntity<List<FrenteTrabajo>> listarFrentesActivos() {
        List<FrenteTrabajo> activos = service.listarFrentesActivos();
        return ResponseEntity.ok(activos);
    }
    @PutMapping("/{id}/editar")
    public ResponseEntity<FrenteTrabajo> editarFrente(
            @PathVariable Long id,
            @RequestBody FrenteTrabajoRequest request
    ) {
        FrenteTrabajo editado = service.editarFrente(id, request);
        return ResponseEntity.ok(editado);
    }


}
