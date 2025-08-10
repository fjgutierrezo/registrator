package com.TMF.registrator.service;

import com.TMF.registrator.model.FrenteTrabajo;
import com.TMF.registrator.model.FrenteTrabajo.EstadoFrente;
import com.TMF.registrator.repository.FrenteTrabajoRepository;
import com.TMF.registrator.dto.FrenteTrabajoRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FrenteTrabajoService {

    private final FrenteTrabajoRepository repository;

    public FrenteTrabajoService(FrenteTrabajoRepository repository) {
        this.repository = repository;
    }

    public List<FrenteTrabajo> listarFrentesActivos() {
        // PASAR enum EstadoFrente.ACTIVO en vez de String
        return repository.findByEstado(EstadoFrente.ACTIVO);
    }

    public FrenteTrabajo crearFrente(FrenteTrabajoRequest request) {
        FrenteTrabajo frente = new FrenteTrabajo();
        frente.setNombre(request.getNombre());
        frente.setCentroCosto(request.getCentroCosto());
        frente.setLatitudCentro(request.getLatitudCentro());
        frente.setLongitudCentro(request.getLongitudCentro());
        frente.setRadioMetros(request.getRadioMetros());
        frente.setCreadoPorCedulaCapataz(request.getCreadoPorCedulaCapataz());
        // fechaInicio y estado se asignan automáticamente en prePersist()
        return repository.save(frente);
    }

    public FrenteTrabajo finalizarFrente(Long id) {
        FrenteTrabajo frente = repository.findById(id).orElseThrow(() -> new RuntimeException("Frente no encontrado"));
        frente.setEstado(EstadoFrente.FINALIZADO);
        frente.setFechaFin(java.time.LocalDateTime.now());
        return repository.save(frente);
    }

    public FrenteTrabajo apagarFrente(Long id) {
        FrenteTrabajo frente = repository.findById(id).orElseThrow(() -> new RuntimeException("Frente no encontrado"));
        frente.setEstado(EstadoFrente.APAGADO);
        frente.setFechaFin(java.time.LocalDateTime.now());
        return repository.save(frente);
    }
    public FrenteTrabajo editarFrente(Long id, FrenteTrabajoRequest request) {
        FrenteTrabajo frente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Frente no encontrado con id " + id));

        if (request.getNombre() != null && !request.getNombre().isEmpty()) {
            frente.setNombre(request.getNombre());
        }
        if (request.getCentroCosto() != null && !request.getCentroCosto().isEmpty()) {
            frente.setCentroCosto(request.getCentroCosto());
        }

        return repository.save(frente);
    }

}
