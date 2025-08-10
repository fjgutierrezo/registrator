package com.TMF.registrator.dto;

import java.util.UUID;

public class TrabajadorEnFrenteRequest {
    private String cedula;
    private String nombre;
    private String rol;
    private Long frenteTrabajoId;

    // Getters y setters
    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Long getFrenteTrabajoId() {
        return frenteTrabajoId;
    }

    public void setFrenteTrabajoId(Long frenteTrabajoId) {
        this.frenteTrabajoId = frenteTrabajoId;
    }
}
