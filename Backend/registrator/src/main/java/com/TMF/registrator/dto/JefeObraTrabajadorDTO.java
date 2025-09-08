package com.TMF.registrator.dto;

import java.time.OffsetDateTime;

public class JefeObraTrabajadorDTO {
    private Long jornadaId;
    private String nombreCompleto;
    private String rol; // opcional si lo tienes en Jornada o puedes poblarlo desde Usuario
    private OffsetDateTime horaEntrada;
    private OffsetDateTime horaSalida;

    public Long getJornadaId() { return jornadaId; }
    public void setJornadaId(Long v) { this.jornadaId = v; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String v) { this.nombreCompleto = v; }

    public String getRol() { return rol; }
    public void setRol(String v) { this.rol = v; }

    public OffsetDateTime getHoraEntrada() { return horaEntrada; }
    public void setHoraEntrada(OffsetDateTime v) { this.horaEntrada = v; }

    public OffsetDateTime getHoraSalida() { return horaSalida; }
    public void setHoraSalida(OffsetDateTime v) { this.horaSalida = v; }
}
