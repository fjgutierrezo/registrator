package com.TMF.registrator.controller;

import com.TMF.registrator.dto.FrenteTrabajoRequest;
import com.TMF.registrator.model.FrenteTrabajo;
import com.TMF.registrator.service.FrenteTrabajoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
