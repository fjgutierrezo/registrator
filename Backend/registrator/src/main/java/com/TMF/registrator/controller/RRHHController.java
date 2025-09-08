package com.TMF.registrator.controller;

import com.TMF.registrator.dto.*;
import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.model.Jornada;
import com.TMF.registrator.model.FrenteTrabajo;
import com.TMF.registrator.model.AprobacionEstado;
import com.TMF.registrator.repository.JornadaRepository;
import com.TMF.registrator.repository.FrenteTrabajoRepository;
import com.TMF.registrator.service.NominaService;
import com.TMF.registrator.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/* =========================
   RRHH (empleados)
   ========================= */
@RestController
@RequestMapping("/rrhh")
public class RRHHController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/empleados")
    public ResponseEntity<String> registrarEmpleado(@Valid @RequestBody RegistroEmpleadoRequest request) {

        if (usuarioService.cedulaExiste(request.getCedula())) {
            return ResponseEntity.badRequest().body("❌ Ya existe un empleado con esa cédula.");
        }

        if (usuarioService.nombreCoincide(request.getPrimerNombre(), request.getPrimerApellido())) {
            System.out.println("⚠ Advertencia: Ya existe una persona con el mismo nombre y apellido, pero diferente cédula.");
        }

        Usuario nuevo = new Usuario();
        nuevo.setPrimerNombre(request.getPrimerNombre());
        nuevo.setSegundoNombre(request.getSegundoNombre());
        nuevo.setPrimerApellido(request.getPrimerApellido());
        nuevo.setSegundoApellido(request.getSegundoApellido());
        nuevo.setDiaNacimiento(request.getDiaNacimiento());
        nuevo.setMesNacimiento(request.getMesNacimiento());
        nuevo.setAnioNacimiento(request.getAnioNacimiento());
        nuevo.setCedula(request.getCedula());
        nuevo.setCelular(request.getCelular());
        nuevo.setDireccion(request.getDireccion());
        nuevo.setBarrio(request.getBarrio());
        nuevo.setArl(request.getArl());
        nuevo.setEps(request.getEps());
        nuevo.setFondoPensiones(request.getFondoPensiones());
        nuevo.setFondoCesantias(request.getFondoCesantias());
        nuevo.setTallaCamisa(request.getTallaCamisa());
        nuevo.setTallaPantalon(request.getTallaPantalon());
        nuevo.setTallaCalzado(request.getTallaCalzado());
        nuevo.setNumeroHijos(request.getNumeroHijos());
        nuevo.setTipoSangre(request.getTipoSangre());
        nuevo.setBanco(request.getBanco());
        nuevo.setNumeroCuenta(request.getNumeroCuenta());
        nuevo.setTipoCuenta(request.getTipoCuenta());
        nuevo.setContactoEmergencia(request.getContactoEmergencia());
        nuevo.setTelefonoContactoEmergencia(request.getTelefonoContactoEmergencia());
        nuevo.setEmail(request.getEmail());
        nuevo.setPassword(request.getPassword());
        nuevo.setRol(request.getRol());
        nuevo.setSalario(request.getSalario());
        nuevo.setBonificacion(request.getBonificacion());
        nuevo.setAuxilioTransporte(request.getAuxilioTransporte());

        usuarioService.guardarUsuario(nuevo);
        return ResponseEntity.ok("✅ Empleado registrado correctamente.");
    }

    @GetMapping("/empleados")
    public ResponseEntity<List<Usuario>> listarEmpleados() {
        return ResponseEntity.ok(usuarioService.obtenerTodosLosEmpleados());
    }

    @GetMapping("/empleados/cedula/{cedula}")
    public ResponseEntity<?> buscarPorCedula(@PathVariable String cedula) {
        return usuarioService.buscarPorCedula(cedula)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Empleado no encontrado con cédula: " + cedula));
    }

    @GetMapping("/empleados/nombre")
    public ResponseEntity<?> buscarPorNombreYApellido(
            @RequestParam String primerNombre,
            @RequestParam String primerApellido
    ) {
        List<Usuario> resultados = usuarioService.buscarPorNombreYApellido(primerNombre, primerApellido);
        if (resultados.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontraron empleados con ese nombre y apellido.");
        }
        return ResponseEntity.ok(resultados);
    }

    @PutMapping("/empleados/{cedula}")
    public ResponseEntity<?> actualizarEmpleado(
            @PathVariable String cedula,
            @RequestBody RegistroEmpleadoRequest request
    ) {
        return usuarioService.actualizarEmpleado(cedula, request);
    }

    @DeleteMapping("/empleados/{cedula}")
    public ResponseEntity<String> eliminarEmpleado(@PathVariable String cedula) {
        String resultado = usuarioService.eliminarEmpleadoPorCedula(cedula);
        if (resultado.contains("eliminado correctamente")) {
            return ResponseEntity.ok(resultado);
        } else {
            return ResponseEntity.status(404).body(resultado);
        }
    }

    @GetMapping("/trabajadores")
    public List<Usuario> obtenerTrabajadores() {
        return usuarioService.obtenerPorRol("Trabajador");
    }
}

/* =========================
   Nómina RRHH (resumen + detalle por mes)
   ========================= */
@RestController
@RequestMapping("/api/rrhh/nomina")
class RRHHNominaController {

    private final JornadaRepository jornadaRepository;
    private final FrenteTrabajoRepository frenteTrabajoRepository;

    public RRHHNominaController(JornadaRepository jornadaRepository,
                                FrenteTrabajoRepository frenteTrabajoRepository) {
        this.jornadaRepository = jornadaRepository;
        this.frenteTrabajoRepository = frenteTrabajoRepository;
    }

    /** Resumen mensual: una fila por empleado (solo jornadas APROBADO_JEFE) */
    @PreAuthorize("hasAnyRole('RRHH','JEFE_OBRA')")
    @GetMapping("/resumen")
    public ResponseEntity<List<NominaResumenDTO>> resumen(
            @RequestParam int year,
            @RequestParam int month
    ) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate inicio = ym.atDay(1);
        LocalDate fin = ym.atEndOfMonth();

        // 🔴 Filtra SOLO por APROBADO_JEFE
        List<Jornada> jornadas = jornadaRepository.findAprobadasEnMes(
                inicio, fin, AprobacionEstado.APROBADO_JEFE);

        Map<String, List<Jornada>> porEmpleado = jornadas.stream()
                .collect(Collectors.groupingBy(Jornada::getCedulaTrabajador));

        List<NominaResumenDTO> salida = porEmpleado.entrySet().stream()
                .map(e -> {
                    String cedula = e.getKey();
                    List<Jornada> deEmpleado = e.getValue();

                    String nombre = deEmpleado.stream()
                            .map(Jornada::getNombreTrabajador)
                            .filter(Objects::nonNull)
                            .findFirst().orElse("Empleado");

                    long dias = deEmpleado.stream()
                            .map(Jornada::getFecha)
                            .filter(Objects::nonNull)
                            .distinct()
                            .count();

                    long valor = 0L; // temporal

                    return new NominaResumenDTO(cedula, nombre, dias, valor);
                })
                .sorted(Comparator.comparing(NominaResumenDTO::getNombreCompleto))
                .collect(Collectors.toList());

        return ResponseEntity.ok(salida);
    }

    /** Detalle mensual por empleado (solo jornadas APROBADO_JEFE) */
    @PreAuthorize("hasAnyRole('RRHH','JEFE_OBRA')")
    @GetMapping("/detalle/{cedula}")
    public ResponseEntity<List<NominaDetalleDTO>> detalle(
            @PathVariable String cedula,
            @RequestParam int year,
            @RequestParam int month
    ) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate inicio = ym.atDay(1);
        LocalDate fin = ym.atEndOfMonth();

        // 🔴 Filtra SOLO por APROBADO_JEFE
        List<Jornada> jornadas = jornadaRepository.findAprobadasPorEmpleadoEnMes(
                cedula, inicio, fin, AprobacionEstado.APROBADO_JEFE);

        // Mapear frenteTrabajoId -> centroCosto
        Set<Long> idsFrente = jornadas.stream()
                .map(Jornada::getFrenteTrabajoId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Long, String> centroPorFrente = frenteTrabajoRepository.findAllById(idsFrente).stream()
                .collect(Collectors.toMap(
                        FrenteTrabajo::getId,
                        f -> Optional.ofNullable(f.getCentroCosto()).orElse("N/D")
                ));

        DateTimeFormatter fFecha = DateTimeFormatter.ISO_LOCAL_DATE;
        DateTimeFormatter fHora  = DateTimeFormatter.ofPattern("HH:mm");

        List<NominaDetalleDTO> salida = jornadas.stream()
                .map(j -> new NominaDetalleDTO(
                        j.getFecha() != null ? j.getFecha().format(fFecha) : "",
                        centroPorFrente.getOrDefault(j.getFrenteTrabajoId(), "N/D"),
                        formatearHora(mejorEntrada(j), fHora),
                        formatearHora(mejorSalida(j), fHora)
                ))
                .sorted(Comparator.comparing(NominaDetalleDTO::getFecha))
                .collect(Collectors.toList());

        return ResponseEntity.ok(salida);
    }

    // ===== helpers =====

    private static OffsetDateTime mejorEntrada(Jornada j) {
        if (j.getHoraEntradaEditada() != null) return j.getHoraEntradaEditada();
        if (j.getHoraEntradaServidor() != null) return j.getHoraEntradaServidor();
        return j.getHoraEntradaCliente();
    }

    private static OffsetDateTime mejorSalida(Jornada j) {
        if (j.getHoraSalidaEditada() != null) return j.getHoraSalidaEditada();
        if (j.getHoraSalidaServidor() != null) return j.getHoraSalidaServidor();
        return j.getHoraSalidaCliente();
    }

    private static String formatearHora(OffsetDateTime odt, DateTimeFormatter fHora) {
        if (odt == null) return null;
        return odt.toLocalTime().format(fHora);
    }

    @Autowired
    private NominaService nominaService;

    // Resumen con valores (devengado/deducciones/neto) acumulados al día
    @PreAuthorize("hasAnyRole('RRHH','JEFE_OBRA')")
    @GetMapping("/calculo/resumen")
    public ResponseEntity<List<NominaCalculoResumenDTO>> resumenConCalculo(
            @RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(nominaService.resumenMensual(year, month));
    }

    // Detalle prestacional/neto para modal
    @PreAuthorize("hasAnyRole('RRHH','JEFE_OBRA')")
    @GetMapping("/calculo/detalle/{cedula}")
    public ResponseEntity<NominaCalculoDetalleDTO> detalleCalculo(
            @PathVariable String cedula, @RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(nominaService.detalleEmpleadoMensual(cedula, year, month));
    }

}
