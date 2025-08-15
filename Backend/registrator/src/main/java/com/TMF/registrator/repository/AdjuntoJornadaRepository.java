package com.TMF.registrator.repository;

import com.TMF.registrator.model.AdjuntoJornada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdjuntoJornadaRepository extends JpaRepository<AdjuntoJornada, Long> {
    List<AdjuntoJornada> findByJornadaId(Long jornadaId);
}
