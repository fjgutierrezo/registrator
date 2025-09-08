// NominaResumenDTO.java
package com.TMF.registrator.dto;

public class NominaResumenDTO {
    private String cedula;
    private String nombreCompleto;
    private long diasTrabajados;
    private long valorPagar; // temporal/representativo

    public NominaResumenDTO(String cedula, String nombreCompleto, long diasTrabajados, long valorPagar) {
        this.cedula = cedula;
        this.nombreCompleto = nombreCompleto;
        this.diasTrabajados = diasTrabajados;
        this.valorPagar = valorPagar;
    }
    // getters/setters

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public long getDiasTrabajados() {
        return diasTrabajados;
    }

    public void setDiasTrabajados(long diasTrabajados) {
        this.diasTrabajados = diasTrabajados;
    }

    public long getValorPagar() {
        return valorPagar;
    }

    public void setValorPagar(long valorPagar) {
        this.valorPagar = valorPagar;
    }
}
