// src/main/java/com/TMF/registrator/dto/NominaCalculoResumenDTO.java
package com.TMF.registrator.dto;

import java.math.BigDecimal;

public class NominaCalculoResumenDTO {
    private String cedula;
    private String nombreCompleto;
    private long diasTrabajados;          //
    private BigDecimal devengado;         // salario proporcional + extras + recargos + aux transporte proporcional
    private BigDecimal deducciones;       // salud + pensión (trabajador)
    private BigDecimal netoAPagar;

    // opcional para UI
    private BigDecimal salarioBase;
    private BigDecimal auxTransporteProporcional;

    // getters/setters...

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

    public BigDecimal getDevengado() {
        return devengado;
    }

    public void setDevengado(BigDecimal devengado) {
        this.devengado = devengado;
    }

    public BigDecimal getDeducciones() {
        return deducciones;
    }

    public void setDeducciones(BigDecimal deducciones) {
        this.deducciones = deducciones;
    }

    public BigDecimal getNetoAPagar() {
        return netoAPagar;
    }

    public void setNetoAPagar(BigDecimal netoAPagar) {
        this.netoAPagar = netoAPagar;
    }

    public BigDecimal getSalarioBase() {
        return salarioBase;
    }

    public void setSalarioBase(BigDecimal salarioBase) {
        this.salarioBase = salarioBase;
    }

    public BigDecimal getAuxTransporteProporcional() {
        return auxTransporteProporcional;
    }

    public void setAuxTransporteProporcional(BigDecimal auxTransporteProporcional) {
        this.auxTransporteProporcional = auxTransporteProporcional;
    }
}
