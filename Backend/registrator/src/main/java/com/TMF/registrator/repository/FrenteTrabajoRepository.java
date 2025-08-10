package com.TMF.registrator.repository;

import com.TMF.registrator.model.FrenteTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.TMF.registrator.model.FrenteTrabajo.EstadoFrente;

import java.util.List;

public interface FrenteTrabajoRepository extends JpaRepository<FrenteTrabajo, Long> {

    @Query("SELECT DISTINCT f FROM FrenteTrabajo f " +
            "JOIN TrabajadorEnFrente t ON f.id = t.frenteTrabajo.id " +
            "WHERE t.cedulaTrabajador = :cedula")
    List<FrenteTrabajo> findFrentesByTrabajadorCedula(String cedula);
    List<FrenteTrabajo> findByEstado(EstadoFrente estado);

}
