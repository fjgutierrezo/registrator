package com.TMF.registrator.dto;

import java.time.OffsetDateTime;

public class CapatazJornadaItemDTO {
    private Long id;
    private String nombreCompleto;
    private String cedula;
    private String frenteNombre;
    private Long frenteTrabajoId;
    private OffsetDateTime horaEntrada; // preferimos mostrar la del servidor
    private OffsetDateTime horaSalida;
    private OffsetDateTime horaEntradaEditada; // si el capataz la cambió
    private OffsetDateTime horaSalidaEditada;  // si el capataz la cambió
    private String estado; // JornadaEstado (ACTIVA/CERRADA) o “CERRADA” en ambos listados
    private String aprobacionEstado; // EN_APROBACION / APROBADO / RECHAZADO

    // getters / setters
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getNombreCompleto() { return nombreCompleto; } public void setNombreCompleto(String n) { this.nombreCompleto = n; }
    public String getCedula() { return cedula; } public void setCedula(String c) { this.cedula = c; }
    public String getFrenteNombre() { return frenteNombre; } public void setFrenteNombre(String f) { this.frenteNombre = f; }
    public Long getFrenteTrabajoId() { return frenteTrabajoId; } public void setFrenteTrabajoId(Long f) { this.frenteTrabajoId = f; }
    public OffsetDateTime getHoraEntrada() { return horaEntrada; } public void setHoraEntrada(OffsetDateTime h) { this.horaEntrada = h; }
    public OffsetDateTime getHoraSalida() { return horaSalida; } public void setHoraSalida(OffsetDateTime h) { this.horaSalida = h; }
    public OffsetDateTime getHoraEntradaEditada() { return horaEntradaEditada; } public void setHoraEntradaEditada(OffsetDateTime h) { this.horaEntradaEditada = h; }
    public OffsetDateTime getHoraSalidaEditada() { return horaSalidaEditada; } public void setHoraSalidaEditada(OffsetDateTime h) { this.horaSalidaEditada = h; }
    public String getEstado() { return estado; } public void setEstado(String e) { this.estado = e; }
    public String getAprobacionEstado() { return aprobacionEstado; } public void setAprobacionEstado(String a) { this.aprobacionEstado = a; }
}
