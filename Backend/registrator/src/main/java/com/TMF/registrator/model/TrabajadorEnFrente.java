package com.TMF.registrator.model;

import jakarta.persistence.*;

@Entity
@Table(name = "trabajador_en_frente")
public class TrabajadorEnFrente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cedulaTrabajador;

    private String nombreTrabajador;

    private String rol; // Por ejemplo: "Ayudante", "Oficial", etc.

    @ManyToOne
    @JoinColumn(name = "frente_id")
    private FrenteTrabajo frenteTrabajo;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCedulaTrabajador() {
        return cedulaTrabajador;
    }

    public void setCedulaTrabajador(String cedulaTrabajador) {
        this.cedulaTrabajador = cedulaTrabajador;
    }

    public String getNombreTrabajador() {
        return nombreTrabajador;
    }

    public void setNombreTrabajador(String nombreTrabajador) {
        this.nombreTrabajador = nombreTrabajador;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public FrenteTrabajo getFrenteTrabajo() {
        return frenteTrabajo;
    }

    public void setFrenteTrabajo(FrenteTrabajo frenteTrabajo) {
        this.frenteTrabajo = frenteTrabajo;
    }
}
