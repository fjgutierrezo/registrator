package com.TMF.registrator.dto;

public class CapatazValidarRequest {
    private String aprobadoPorCedula;
    private String aprobadoPorNombre;

    // Opcionales: si edita horas, deben venir en ISO-8601; si alguno viene, "motivo" es OBLIGATORIO.
    private String horaEntradaEditadaISO;
    private String horaSalidaEditadaISO;
    private String motivoEdicion;

    public String getAprobadoPorCedula() { return aprobadoPorCedula; }
    public void setAprobadoPorCedula(String v) { this.aprobadoPorCedula = v; }

    public String getAprobadoPorNombre() { return aprobadoPorNombre; }
    public void setAprobadoPorNombre(String v) { this.aprobadoPorNombre = v; }

    public String getHoraEntradaEditadaISO() { return horaEntradaEditadaISO; }
    public void setHoraEntradaEditadaISO(String v) { this.horaEntradaEditadaISO = v; }

    public String getHoraSalidaEditadaISO() { return horaSalidaEditadaISO; }
    public void setHoraSalidaEditadaISO(String v) { this.horaSalidaEditadaISO = v; }

    public String getMotivoEdicion() { return motivoEdicion; }
    public void setMotivoEdicion(String v) { this.motivoEdicion = v; }
}
