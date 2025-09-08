// NominaDetalleDTO.java
package com.TMF.registrator.dto;

public class NominaDetalleDTO {
    private String fecha;     // "YYYY-MM-DD"
    private String centro;    // centro de costo
    private String entrada;   // "HH:mm" o ISO
    private String salida;    // "HH:mm" o ISO

    public NominaDetalleDTO(String fecha, String centro, String entrada, String salida) {
        this.fecha = fecha;
        this.centro = centro;
        this.entrada = entrada;
        this.salida = salida;
    }
    // getters/setters

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getCentro() {
        return centro;
    }

    public void setCentro(String centro) {
        this.centro = centro;
    }

    public String getEntrada() {
        return entrada;
    }

    public void setEntrada(String entrada) {
        this.entrada = entrada;
    }

    public String getSalida() {
        return salida;
    }

    public void setSalida(String salida) {
        this.salida = salida;
    }
}
