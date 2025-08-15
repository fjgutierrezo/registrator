package com.TMF.registrator.repository;

import com.TMF.registrator.model.Jornada;
import com.TMF.registrator.model.JornadaEstado;
import com.TMF.registrator.model.AprobacionEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface JornadaRepository extends JpaRepository<Jornada, Long> {
    Optional<Jornada> findByCedulaTrabajadorAndFrenteTrabajoIdAndFechaAndEstado(
            String cedula, Long frenteId, LocalDate fecha, JornadaEstado estado);

    Optional<Jornada> findByCedulaTrabajadorAndFecha(String cedula, LocalDate fecha);

    List<Jornada> findByFechaAndAprobacionEstado(LocalDate fecha, AprobacionEstado estado);
    Optional<Jornada> findByCedulaTrabajadorAndFechaAndEstado(
            String cedula, LocalDate fecha, JornadaEstado estado
    );


    java.util.List<Jornada> findByFechaBetweenAndAprobacionEstado(
            LocalDate inicio, LocalDate fin, com.TMF.registrator.model.AprobacionEstado estado
    );

}
