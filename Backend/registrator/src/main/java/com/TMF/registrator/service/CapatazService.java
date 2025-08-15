package com.TMF.registrator.service;

import com.TMF.registrator.dto.*;
import com.TMF.registrator.model.*;
import com.TMF.registrator.repository.*;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CapatazService {

    private final JornadaRepository jornadaRepo;
    private final FrenteTrabajoRepository frenteRepo;

    public CapatazService(JornadaRepository jornadaRepo, FrenteTrabajoRepository frenteRepo) {
        this.jornadaRepo = jornadaRepo;
        this.frenteRepo = frenteRepo;
    }

    // --- Helpers de fecha (mes en curso) ---
    private LocalDate firstDayOfCurrentMonthUTC() {
        return LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1);
    }
    private LocalDate lastDayOfCurrentMonthUTC() {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        return now.withDayOfMonth(now.lengthOfMonth());
    }

    // --- Listado agrupado por día ---
    public List<CapatazDiaGrupoDTO> listarPendientesMesActual() {
        LocalDate ini = firstDayOfCurrentMonthUTC();
        LocalDate fin = lastDayOfCurrentMonthUTC();
        List<Jornada> js = jornadaRepo.findByFechaBetweenAndAprobacionEstado(ini, fin, AprobacionEstado.EN_APROBACION);
        return agruparPorDia(js);
    }

    public List<CapatazDiaGrupoDTO> listarValidadasMesActual() {
        LocalDate ini = firstDayOfCurrentMonthUTC();
        LocalDate fin = lastDayOfCurrentMonthUTC();
        List<Jornada> js = jornadaRepo.findByFechaBetweenAndAprobacionEstado(ini, fin, AprobacionEstado.APROBADO);
        return agruparPorDia(js);
    }

    private List<CapatazDiaGrupoDTO> agruparPorDia(List<Jornada> jornadas) {
        Map<LocalDate, List<Jornada>> porDia = jornadas.stream()
                .collect(Collectors.groupingBy(Jornada::getFecha, TreeMap::new, Collectors.toList()));

        List<CapatazDiaGrupoDTO> dias = new ArrayList<>();
        for (Map.Entry<LocalDate, List<Jornada>> e : porDia.entrySet()) {
            CapatazDiaGrupoDTO dia = new CapatazDiaGrupoDTO();
            dia.setFecha(e.getKey());
            dia.setTrabajadores(e.getValue().stream().map(this::toItem).collect(Collectors.toList()));
            dias.add(dia);
        }
        return dias;
    }

    private CapatazJornadaItemDTO toItem(Jornada j) {
        CapatazJornadaItemDTO dto = new CapatazJornadaItemDTO();
        dto.setId(j.getId());
        dto.setNombreCompleto(j.getNombreTrabajador());
        dto.setCedula(j.getCedulaTrabajador());
        dto.setFrenteTrabajoId(j.getFrenteTrabajoId());
        dto.setFrenteNombre(obtenerNombreFrente(j.getFrenteTrabajoId()));
        dto.setHoraEntrada(j.getHoraEntradaServidor()); // mostramos server por consistencia
        dto.setHoraSalida(j.getHoraSalidaServidor());
        dto.setHoraEntradaEditada(j.getHoraEntradaEditada());
        dto.setHoraSalidaEditada(j.getHoraSalidaEditada());
        dto.setEstado(j.getEstado().name());
        dto.setAprobacionEstado(j.getAprobacionEstado().name());
        return dto;
    }

    private String obtenerNombreFrente(Long frenteId) {
        return frenteRepo.findById(frenteId).map(f -> f.getNombre()).orElse("Frente #" + frenteId);
    }

    // --- Validar (con posibles ediciones) ---
    public void validarJornada(Long id, CapatazValidarRequest req) {
        Jornada j = jornadaRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Jornada no existe"));
        if (j.getEstado() != JornadaEstado.CERRADA) {
            throw new IllegalStateException("La jornada debe estar CERRADA para validar");
        }
        // Edición de horas (opcional)
        boolean editaEntrada = req.getHoraEntradaEditadaISO() != null && !req.getHoraEntradaEditadaISO().isBlank();
        boolean editaSalida  = req.getHoraSalidaEditadaISO()  != null && !req.getHoraSalidaEditadaISO().isBlank();
        if (editaEntrada || editaSalida) {
            if (req.getMotivoEdicion() == null || req.getMotivoEdicion().isBlank()) {
                throw new IllegalArgumentException("Motivo de edición es obligatorio cuando se modifican horas");
            }
            if (editaEntrada) j.setHoraEntradaEditada(OffsetDateTime.parse(req.getHoraEntradaEditadaISO()));
            if (editaSalida)  j.setHoraSalidaEditada(OffsetDateTime.parse(req.getHoraSalidaEditadaISO()));
            j.setMotivoEdicionCapataz(req.getMotivoEdicion());
        }

        j.setAprobacionEstado(AprobacionEstado.APROBADO);
        j.setAprobadoPorCedula(req.getAprobadoPorCedula());
        j.setAprobadoPorNombre(req.getAprobadoPorNombre());
        j.setAprobadoEn(OffsetDateTime.now(ZoneOffset.UTC));
        jornadaRepo.save(j);
    }

    // --- Quitar validación (revierte a EN_APROBACION) ---
    public void quitarValidacion(Long id) {
        Jornada j = jornadaRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Jornada no existe"));
        if (j.getAprobacionEstado() != AprobacionEstado.APROBADO) {
            throw new IllegalStateException("Solo se puede quitar validación a jornadas APROBADAS");
        }
        j.setAprobacionEstado(AprobacionEstado.EN_APROBACION);
        // Conservamos las horas editadas y el motivo como trazabilidad
        j.setAprobadoPorCedula(null);
        j.setAprobadoPorNombre(null);
        j.setAprobadoEn(null);
        jornadaRepo.save(j);
    }
}
