package com.TMF.registrator.dto;

import java.time.OffsetDateTime;

public class JornadaActivaResponse {
    private Long jornadaId;
    private OffsetDateTime horaEntradaServidor;
    private OffsetDateTime horaEntradaCliente;
    private Long frenteTrabajoId;  // <--- NUEVO

    public Long getJornadaId() { return jornadaId; }
    public void setJornadaId(Long jornadaId) { this.jornadaId = jornadaId; }

    public OffsetDateTime getHoraEntradaServidor() { return horaEntradaServidor; }
    public void setHoraEntradaServidor(OffsetDateTime horaEntradaServidor) { this.horaEntradaServidor = horaEntradaServidor; }

    public OffsetDateTime getHoraEntradaCliente() { return horaEntradaCliente; }
    public void setHoraEntradaCliente(OffsetDateTime horaEntradaCliente) { this.horaEntradaCliente = horaEntradaCliente; }

    public Long getFrenteTrabajoId() { return frenteTrabajoId; }
    public void setFrenteTrabajoId(Long frenteTrabajoId) { this.frenteTrabajoId = frenteTrabajoId; }
}
