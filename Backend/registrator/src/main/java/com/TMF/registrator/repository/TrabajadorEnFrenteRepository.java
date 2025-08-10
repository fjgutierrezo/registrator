package com.TMF.registrator.repository;

import com.TMF.registrator.model.TrabajadorEnFrente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TrabajadorEnFrenteRepository extends JpaRepository<TrabajadorEnFrente, Long> {

    // Busca todos los TrabajadorEnFrente que pertenecen a un FrenteTrabajo por su UUID
    List<TrabajadorEnFrente> findByFrenteTrabajoId(Long frenteTrabajoId);

    // Busca por cédula del trabajador
    List<TrabajadorEnFrente> findByCedulaTrabajador(String cedula);

    void deleteById(Long id);
}
