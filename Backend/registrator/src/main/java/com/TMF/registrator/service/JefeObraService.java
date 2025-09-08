package com.TMF.registrator.service;

import com.TMF.registrator.dto.*;
import com.TMF.registrator.model.*;
import com.TMF.registrator.repository.FrenteTrabajoRepository;
import com.TMF.registrator.repository.JornadaRepository;
import com.TMF.registrator.security.AuthUtils;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JefeObraService {

    private final JornadaRepository jornadaRepo;
    private final FrenteTrabajoRepository frenteRepo;
    private final AuthUtils authUtils;

    public JefeObraService(JornadaRepository jornadaRepo, FrenteTrabajoRepository frenteRepo, AuthUtils authUtils) {
        this.jornadaRepo = jornadaRepo;
        this.frenteRepo = frenteRepo;
        this.authUtils = authUtils;
    }

    // ============ LISTAR PENDIENTES (mes en curso) AGRUPADO por DIA -> FRENTE ============
    public List<JefeObraDiaDTO> listarPendientesMesActual() {
        LocalDate ini = firstDayOfCurrentMonthUTC();
        LocalDate fin = lastDayOfCurrentMonthUTC();

        List<Jornada> base = jornadaRepo.findByFechaBetweenAndAprobacionEstado(
                ini, fin, AprobacionEstado.APROBADO_CAPATAZ // solo lo ya aprobado por capataz
        );

        // Agrupar por fecha
        Map<LocalDate, List<Jornada>> porDia = base.stream()
                .collect(Collectors.groupingBy(Jornada::getFecha, TreeMap::new, Collectors.toList()));

        List<JefeObraDiaDTO> dias = new ArrayList<>();
        for (Map.Entry<LocalDate, List<Jornada>> e : porDia.entrySet()) {
            JefeObraDiaDTO diaDTO = new JefeObraDiaDTO();
            diaDTO.setFecha(e.getKey());

            // Agrupar por frente
            Map<Long, List<Jornada>> porFrente = e.getValue().stream()
                    .collect(Collectors.groupingBy(Jornada::getFrenteTrabajoId, TreeMap::new, Collectors.toList()));

            List<JefeObraFrenteDTO> frentes = new ArrayList<>();
            for (Map.Entry<Long, List<Jornada>> fEntry : porFrente.entrySet()) {
                Long frenteId = fEntry.getKey();
                List<Jornada> jornadasFrente = fEntry.getValue();

                JefeObraFrenteDTO fDTO = new JefeObraFrenteDTO();
                fDTO.setFrenteId(frenteId);
                fDTO.setNombreFrente(nombreFrente(frenteId));
                fDTO.setCentroCosto(centroCostoFrente(frenteId));

                List<JefeObraTrabajadorDTO> trabajadores = jornadasFrente.stream().map(this::toTrabajador).toList();
                fDTO.setTrabajadores(trabajadores);

                frentes.add(fDTO);
            }
            diaDTO.setFrentes(frentes);
            dias.add(diaDTO);
        }
        return dias;
    }

    // ============ APROBAR PAQUETE (todas las jornadas de un frente en una fecha) ============
    public int aprobarPaquete(LocalDate fecha, Long frenteId) {
        List<Jornada> jornadas = jornadaRepo.findByFechaAndFrenteTrabajoIdAndAprobacionEstado(
                fecha, frenteId, AprobacionEstado.APROBADO_CAPATAZ
        );
        if (jornadas.isEmpty()) return 0;

        Usuario u = authUtils.currentUserOrThrow();
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

        for (Jornada j : jornadas) {
            j.setAprobacionEstado(AprobacionEstado.APROBADO_JEFE);
            j.setJefeAprobadoPorCedula(u.getCedula());
            j.setJefeAprobadoPorNombre( (u.getPrimerNombre() + " " + u.getPrimerApellido()).trim() );
            j.setJefeAprobadoEn(now);
        }
        jornadaRepo.saveAll(jornadas);
        return jornadas.size();
    }

    private static String ns(String s){ return s==null? "": s.trim(); }
    private static String nombre(Usuario u){
        return ("%s %s %s %s".formatted(
                ns(u.getPrimerNombre()), ns(u.getSegundoNombre()),
                ns(u.getPrimerApellido()), ns(u.getSegundoApellido())
        )).replaceAll("\\s+"," ").trim();
    }


    // ====================== HELPERS ======================
    private JefeObraTrabajadorDTO toTrabajador(Jornada j) {
        JefeObraTrabajadorDTO dto = new JefeObraTrabajadorDTO();
        dto.setJornadaId(j.getId());
        dto.setNombreCompleto((j.getNombreTrabajador() == null || j.getNombreTrabajador().isBlank())
                ? j.getCedulaTrabajador() : j.getNombreTrabajador());
        // Rol: si lo tienes en Jornada, úsalo; si no, puedes dejarlo vacío y luego poblarlo
        dto.setRol(null);
        // Horas: preferimos las editadas si existen, sino las del servidor
        dto.setHoraEntrada(j.getHoraEntradaEditada() != null ? j.getHoraEntradaEditada() : j.getHoraEntradaServidor());
        dto.setHoraSalida( j.getHoraSalidaEditada()  != null ? j.getHoraSalidaEditada()  : j.getHoraSalidaServidor());
        return dto;
    }

    private String nombreFrente(Long id) {
        return frenteRepo.findById(id).map(f -> {
            String n = f.getNombre();
            return (n == null || n.isBlank()) ? "Frente #" + id : n;
        }).orElse("Frente #" + id);
    }

    private String centroCostoFrente(Long id) {
        return frenteRepo.findById(id).map(f -> {
            String cc = f.getCentroCosto();
            return (cc == null || cc.isBlank()) ? "N/D" : cc;
        }).orElse("N/D");
    }

    private static LocalDate firstDayOfCurrentMonthUTC() {
        return LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1);
    }

    private static LocalDate lastDayOfCurrentMonthUTC() {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        return now.withDayOfMonth(now.lengthOfMonth());
    }
}
