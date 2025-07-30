package com.TMF.registrator.service;

import com.TMF.registrator.dto.FrenteTrabajoRequest;
import com.TMF.registrator.model.FrenteTrabajo;
import com.TMF.registrator.repository.FrenteTrabajoRepository;
import org.springframework.stereotype.Service;

@Service
public class FrenteTrabajoService {

    private final FrenteTrabajoRepository repository;

    public FrenteTrabajoService(FrenteTrabajoRepository repository) {
        this.repository = repository;
    }

    public FrenteTrabajo crearFrente(FrenteTrabajoRequest request) {
        FrenteTrabajo frente = new FrenteTrabajo();
        frente.setNombre(request.getNombre());
        frente.setCentroCosto(request.getCentroCosto());
        frente.setLatitudCentro(request.getLatitudCentro());
        frente.setLongitudCentro(request.getLongitudCentro());
        frente.setRadioMetros(request.getRadioMetros());
        frente.setCreadoPorCedulaCapataz(request.getCreadoPorCedulaCapataz());

        return repository.save(frente);
    }
}
