package com.TMF.registrator.service;

import com.TMF.registrator.dto.TrabajadorEnFrenteRequest;
import com.TMF.registrator.model.FrenteTrabajo;
import com.TMF.registrator.model.TrabajadorEnFrente;
import com.TMF.registrator.repository.FrenteTrabajoRepository;
import com.TMF.registrator.repository.TrabajadorEnFrenteRepository;
import org.springframework.stereotype.Service;
import java.util.NoSuchElementException;


import java.util.List;
import java.util.Optional;

@Service
public class TrabajadorEnFrenteService {

    private final TrabajadorEnFrenteRepository repository;
    private final FrenteTrabajoRepository frenteTrabajoRepository;

    public TrabajadorEnFrenteService(TrabajadorEnFrenteRepository repository,
                                     FrenteTrabajoRepository frenteTrabajoRepository) {
        this.repository = repository;
        this.frenteTrabajoRepository = frenteTrabajoRepository;
    }

    public List<TrabajadorEnFrente> listarPorFrente(long frenteTrabajoId) {
        return repository.findByFrenteTrabajoId(frenteTrabajoId);
    }

    public List<TrabajadorEnFrente> listarPorCedula(String cedula) {
        return repository.findByCedulaTrabajador(cedula);
    }

    public TrabajadorEnFrente guardarDesdeRequest(TrabajadorEnFrenteRequest request) {
        Optional<FrenteTrabajo> frenteOptional = frenteTrabajoRepository.findById(request.getFrenteTrabajoId());
        if (frenteOptional.isEmpty()) {
            throw new NoSuchElementException("Frente de trabajo no encontrado");
        }

        FrenteTrabajo frente = frenteOptional.get();

        // Validar si el trabajador ya está en el frente
        List<TrabajadorEnFrente> existentes = repository.findByFrenteTrabajoId(frente.getId());
        boolean yaExiste = existentes.stream().anyMatch(t ->
                t.getCedulaTrabajador().equals(request.getCedula())
        );

        if (yaExiste) {
            throw new IllegalStateException("El trabajador ya está asignado a este frente de trabajo.");
        }

        TrabajadorEnFrente nuevo = new TrabajadorEnFrente();
        nuevo.setCedulaTrabajador(request.getCedula());
        nuevo.setNombreTrabajador(request.getNombre());
        nuevo.setRol(request.getRol());
        nuevo.setFrenteTrabajo(frente);

        return repository.save(nuevo);
    }


    public void eliminarPorId(Long id) {
        repository.deleteById(id);
    }


}

