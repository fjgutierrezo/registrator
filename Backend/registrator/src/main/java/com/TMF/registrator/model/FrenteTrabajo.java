package com.TMF.registrator.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "frente_trabajo")
public class FrenteTrabajo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String centroCosto;
    private Double latitudCentro;
    private Double longitudCentro;
    private double radioMetros;
    private String creadoPorCedulaCapataz;

    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    @Enumerated(EnumType.STRING)
    private EstadoFrente estado;

    public enum EstadoFrente {
        ACTIVO,
        APAGADO,
        FINALIZADO
    }

    @PrePersist
    public void prePersist() {
        this.fechaInicio = LocalDateTime.now();
        this.estado = EstadoFrente.ACTIVO;
    }

    // --- Getters y Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCentroCosto() { return centroCosto; }
    public void setCentroCosto(String centroCosto) { this.centroCosto = centroCosto; }
    public Double getLatitudCentro() { return latitudCentro; }
    public void setLatitudCentro(Double latitudCentro) { this.latitudCentro = latitudCentro; }
    public Double getLongitudCentro() { return longitudCentro; }
    public void setLongitudCentro(Double longitudCentro) { this.longitudCentro = longitudCentro; }
    public double getRadioMetros() { return radioMetros; }
    public void setRadioMetros(double radioMetros) { this.radioMetros = radioMetros; }
    public String getCreadoPorCedulaCapataz() { return creadoPorCedulaCapataz; }
    public void setCreadoPorCedulaCapataz(String creadoPorCedulaCapataz) { this.creadoPorCedulaCapataz = creadoPorCedulaCapataz; }
    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
    public EstadoFrente getEstado() { return estado; }
    public void setEstado(EstadoFrente estado) { this.estado = estado; }
}
