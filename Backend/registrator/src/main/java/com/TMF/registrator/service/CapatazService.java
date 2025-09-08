package com.TMF.registrator.service;

import com.TMF.registrator.dto.CapatazDiaGrupoDTO;
import com.TMF.registrator.dto.CapatazJornadaItemDTO;
import com.TMF.registrator.dto.CapatazValidarRequest;
import com.TMF.registrator.model.AprobacionEstado;
import com.TMF.registrator.model.Jornada;
import com.TMF.registrator.model.JornadaEstado;
import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.repository.FrenteTrabajoRepository;
import com.TMF.registrator.repository.JornadaRepository;
import com.TMF.registrator.security.AuthUtils;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CapatazService {

    private final JornadaRepository jornadaRepo;
    private final FrenteTrabajoRepository frenteRepo;
    private final AuthUtils authUtils;

    public CapatazService(JornadaRepository jornadaRepo,
                          FrenteTrabajoRepository frenteRepo,AuthUtils authUtils) {
        this.jornadaRepo = jornadaRepo;
        this.frenteRepo = frenteRepo;
        this.authUtils = authUtils;
    }

    /* ==========================
       Listados agrupados por día
       ========================== */

    public List<CapatazDiaGrupoDTO> listarPendientesMesActual() {
        LocalDate ini = firstDayOfCurrentMonthUTC();
        LocalDate fin = lastDayOfCurrentMonthUTC();
        List<Jornada> js = jornadaRepo.findByFechaBetweenAndAprobacionEstado(
                ini, fin, AprobacionEstado.EN_APROBACION
        );
        return agruparPorDia(js);
    }

    public List<CapatazDiaGrupoDTO> listarValidadasMesActual() {
        LocalDate ini = firstDayOfCurrentMonthUTC();
        LocalDate fin = lastDayOfCurrentMonthUTC();
        List<Jornada> js = jornadaRepo.findByFechaBetweenAndAprobacionEstado(
                ini, fin, AprobacionEstado.APROBADO_CAPATAZ
        );
        return agruparPorDia(js);
    }

    private List<CapatazDiaGrupoDTO> agruparPorDia(List<Jornada> jornadas) {
        Map<LocalDate, List<Jornada>> porDia = jornadas.stream()
                .collect(Collectors.groupingBy(Jornada::getFecha, TreeMap::new, Collectors.toList()));

        List<CapatazDiaGrupoDTO> out = new ArrayList<>();
        for (Map.Entry<LocalDate, List<Jornada>> e : porDia.entrySet()) {
            CapatazDiaGrupoDTO dto = new CapatazDiaGrupoDTO();
            dto.setFecha(e.getKey());
            dto.setTrabajadores(e.getValue().stream().map(this::toItem).collect(Collectors.toList()));
            out.add(dto);
        }
        return out;
    }

    private CapatazJornadaItemDTO toItem(Jornada j) {
        CapatazJornadaItemDTO dto = new CapatazJornadaItemDTO();
        dto.setId(j.getId());

        String nombre = j.getNombreTrabajador();
        if (nombre == null || nombre.isBlank()) {
            nombre = j.getCedulaTrabajador(); // fallback para jornadas viejas
        }
        dto.setNombreCompleto(nombre);

        dto.setCedula(j.getCedulaTrabajador());
        dto.setFrenteTrabajoId(j.getFrenteTrabajoId());
        dto.setFrenteNombre(obtenerNombreFrente(j.getFrenteTrabajoId()));

        // Mostrar horas del servidor por consistencia; si capataz editó, también las enviamos
        dto.setHoraEntrada(j.getHoraEntradaServidor());
        dto.setHoraSalida(j.getHoraSalidaServidor());
        dto.setHoraEntradaEditada(j.getHoraEntradaEditada());
        dto.setHoraSalidaEditada(j.getHoraSalidaEditada());

        dto.setEstado(j.getEstado() != null ? j.getEstado().name() : JornadaEstado.CERRADA.name());
        dto.setAprobacionEstado(j.getAprobacionEstado() != null ? j.getAprobacionEstado().name() : AprobacionEstado.EN_APROBACION.name());
        return dto;
    }

    private String obtenerNombreFrente(Long frenteId) {
        if (frenteId == null) return "Frente N/D";
        return frenteRepo.findById(frenteId)
                .map(f -> {
                    String n = f.getNombre();
                    return (n == null || n.isBlank()) ? ("Frente #" + frenteId) : n;
                })
                .orElse("Frente #" + frenteId);
    }

    /* ==========================
                Acciones
       ========================== */

    // Validar una jornada (opcionalmente con edición de horas)
    public void validarJornada(Long id, String horaEntradaEditadaISO, String horaSalidaEditadaISO, String motivoEdicion) {
        Jornada j = jornadaRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Jornada no existe"));
        if (j.getEstado() != JornadaEstado.CERRADA) {
            throw new IllegalStateException("La jornada debe estar CERRADA para validar");
        }

        boolean editaEntrada = horaEntradaEditadaISO != null && !horaEntradaEditadaISO.isBlank();
        boolean editaSalida  = horaSalidaEditadaISO  != null && !horaSalidaEditadaISO.isBlank();
        if (editaEntrada || editaSalida) {
            if (motivoEdicion == null || motivoEdicion.isBlank()) {
                throw new IllegalArgumentException("Motivo de edición es obligatorio");
            }
            if (editaEntrada) j.setHoraEntradaEditada(OffsetDateTime.parse(horaEntradaEditadaISO));
            if (editaSalida)  j.setHoraSalidaEditada(OffsetDateTime.parse(horaSalidaEditadaISO));
            j.setMotivoEdicionCapataz(motivoEdicion.trim());
        }

        Usuario u = authUtils.currentUserOrThrow();
        j.setAprobacionEstado(AprobacionEstado.APROBADO_CAPATAZ);
        j.setAprobadoPorCedula(u.getCedula());
        j.setAprobadoPorNombre( (u.getPrimerNombre() + " " + u.getPrimerApellido()).trim() );
        j.setAprobadoEn(OffsetDateTime.now(ZoneOffset.UTC));

        jornadaRepo.save(j);
    }


    private static String ns(String s){ return s==null? "": s.trim(); }
    private static String nombre(Usuario u){
        return ("%s %s %s %s".formatted(
                ns(u.getPrimerNombre()), ns(u.getSegundoNombre()),
                ns(u.getPrimerApellido()), ns(u.getSegundoApellido())
        )).replaceAll("\\s+"," ").trim();
    }

    // Quitar validación → vuelve a EN_APROBACION (conserva horas editadas como trazabilidad)
    public void quitarValidacion(Long id) {
        Jornada j = jornadaRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jornada no existe"));

        if (j.getAprobacionEstado() != AprobacionEstado.APROBADO_CAPATAZ) {
            throw new IllegalStateException("Solo se puede quitar validación a jornadas APROBADAS");
        }

        j.setAprobacionEstado(AprobacionEstado.EN_APROBACION);
        j.setAprobadoPorCedula(null);
        j.setAprobadoPorNombre(null);
        j.setAprobadoEn(null);

        jornadaRepo.save(j);
    }

    /* ==========================
               Helpers
       ========================== */

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static LocalDate firstDayOfCurrentMonthUTC() {
        return LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1);
    }

    private static LocalDate lastDayOfCurrentMonthUTC() {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        return now.withDayOfMonth(now.lengthOfMonth());
    }


}
