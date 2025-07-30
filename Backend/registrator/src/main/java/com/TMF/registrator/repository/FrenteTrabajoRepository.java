package com.TMF.registrator.repository;

import com.TMF.registrator.model.FrenteTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FrenteTrabajoRepository extends JpaRepository<FrenteTrabajo, UUID> {
}
