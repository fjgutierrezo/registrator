package com.TMF.registrator.controller;

import com.TMF.registrator.dto.JornadaActivaResponse;
import com.TMF.registrator.dto.JornadaEntradaRequest;
import com.TMF.registrator.dto.JornadaSalidaRequest;
import com.TMF.registrator.model.AdjuntoJornada;
import com.TMF.registrator.model.Jornada;
import com.TMF.registrator.model.AprobacionEstado;
import com.TMF.registrator.model.JornadaEstado;
import com.TMF.registrator.repository.JornadaRepository;
import com.TMF.registrator.service.JornadaService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;

@RestController
@RequestMapping("/api/jornadas")
public class JornadaController {

    private final JornadaService service;
    private final JornadaRepository jornadaRepo;

    public JornadaController(JornadaService service, JornadaRepository jornadaRepo) {
        this.service = service;
        this.jornadaRepo = jornadaRepo;
    }

    @PostMapping(value="/entrada", consumes = {"multipart/form-data"})
    public ResponseEntity<?> crearEntrada(
            @RequestPart("data") JornadaEntradaRequest data,
            @RequestPart(value="files", required=false) MultipartFile[] files,
            HttpServletRequest request
    ) {
        JornadaActivaResponse res = service.crearEntrada(data, clientIp(request), request.getHeader("User-Agent"));
        if (files != null && files.length > 0) {
            service.adjuntarArchivos(res.getJornadaId(), AdjuntoJornada.TipoRegistro.ENTRADA, files);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping(value="/{id}/salida", consumes = {"multipart/form-data"})
    public ResponseEntity<?> registrarSalida(
            @PathVariable Long id,
            @RequestPart("data") JornadaSalidaRequest data,
            @RequestPart(value="files", required=false) MultipartFile[] files,
            HttpServletRequest request
    ) {
        service.registrarSalida(id, data, clientIp(request), request.getHeader("User-Agent"));
        if (files != null && files.length > 0) {
            service.adjuntarArchivos(id, AdjuntoJornada.TipoRegistro.SALIDA, files);
        }
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @GetMapping("/activas")
    public ResponseEntity<?> getActiva(@RequestParam String cedula, @RequestParam Long frenteId) {
        return service.getActiva(cedula, frenteId)
                .<ResponseEntity<?>>map(j -> ResponseEntity.ok(toResponse(j)))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    // --- Aprobaciones (superior) ---

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobar(
            @PathVariable Long id,
            @RequestParam String aprobadoPorCedula,
            @RequestParam String aprobadoPorNombre
    ) {
        Jornada j = jornadaRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("No existe la jornada"));
        if (j.getEstado() != JornadaEstado.CERRADA) {
            return ResponseEntity.badRequest().body("La jornada debe estar CERRADA para aprobarse");
        }
        j.setAprobacionEstado(AprobacionEstado.APROBADO_CAPATAZ);
        j.setAprobadoPorCedula(aprobadoPorCedula);
        j.setAprobadoPorNombre(aprobadoPorNombre);
        j.setAprobadoEn(OffsetDateTime.now(ZoneOffset.UTC));
        jornadaRepo.save(j);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazar(
            @PathVariable Long id,
            @RequestParam String motivo
    ) {
        Jornada j = jornadaRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("No existe la jornada"));
        if (j.getEstado() != JornadaEstado.CERRADA) {
            return ResponseEntity.badRequest().body("La jornada debe estar CERRADA para rechazo");
        }
        j.setAprobacionEstado(AprobacionEstado.RECHAZADO);
        j.setRechazoMotivo(motivo);
        j.setAprobadoEn(OffsetDateTime.now(ZoneOffset.UTC));
        jornadaRepo.save(j);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    private JornadaActivaResponse toResponse(Jornada j) {
        JornadaActivaResponse r = new JornadaActivaResponse();
        r.setJornadaId(j.getId());
        r.setHoraEntradaServidor(j.getHoraEntradaServidor());
        r.setHoraEntradaCliente(j.getHoraEntradaCliente());
        r.setFrenteTrabajoId(j.getFrenteTrabajoId());
        return r;
    }

    private String clientIp(HttpServletRequest req) {
        String h = req.getHeader("X-Forwarded-For");
        if (h != null && !h.isBlank()) return h.split(",")[0].trim();
        return req.getRemoteAddr();
    }
    @GetMapping("/activaPorCedula")
    public ResponseEntity<?> getActivaPorCedula(@RequestParam String cedula) {
        return service.getActivaPorCedula(cedula)
                .<ResponseEntity<?>>map(j -> ResponseEntity.ok(toResponse(j)))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

}
