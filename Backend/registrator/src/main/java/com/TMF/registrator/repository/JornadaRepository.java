package com.TMF.registrator.repository;

import com.TMF.registrator.model.AprobacionEstado;
import com.TMF.registrator.model.Jornada;
import com.TMF.registrator.model.JornadaEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface JornadaRepository extends JpaRepository<Jornada, Long> {

    // ===== EXISTENTES =====
    Optional<Jornada> findByCedulaTrabajadorAndFrenteTrabajoIdAndFechaAndEstado(
            String cedula,
            Long frenteId,
            LocalDate fecha,
            JornadaEstado estado
    );

    Optional<Jornada> findByCedulaTrabajadorAndFecha(String cedula, LocalDate fecha);

    List<Jornada> findByFechaAndAprobacionEstado(LocalDate fecha, AprobacionEstado estado);

    Optional<Jornada> findByCedulaTrabajadorAndFechaAndEstado(
            String cedula,
            LocalDate fecha,
            JornadaEstado estado
    );

    List<Jornada> findByFechaBetweenAndAprobacionEstado(
            LocalDate inicio,
            LocalDate fin,
            AprobacionEstado estado
    );

    List<Jornada> findByFechaAndFrenteTrabajoIdAndAprobacionEstado(
            LocalDate fecha,
            Long frenteTrabajoId,
            AprobacionEstado estado
    );

    // ===== NUEVA (detalle por empleado ordenado) =====
    List<Jornada> findByCedulaTrabajadorAndFechaBetweenAndAprobacionEstadoOrderByFechaAsc(
            String cedulaTrabajador,
            LocalDate inicio,
            LocalDate fin,
            AprobacionEstado estado
    );

    // ===== ALIASES (para mantener firmas usadas por controladores) =====
    default List<Jornada> findAprobadasEnMes(LocalDate inicio, LocalDate fin, AprobacionEstado estado) {
        return findByFechaBetweenAndAprobacionEstado(inicio, fin, estado);
    }

    default List<Jornada> findAprobadasPorEmpleadoEnMes(String cedula, LocalDate inicio, LocalDate fin, AprobacionEstado estado) {
        return findByCedulaTrabajadorAndFechaBetweenAndAprobacionEstadoOrderByFechaAsc(cedula, inicio, fin, estado);
    }
}
