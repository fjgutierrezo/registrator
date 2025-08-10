package com.TMF.registrator.dto;

import java.util.List;

public class FrenteTrabajoRequest {

    private String nombre;
    private String centroCosto;
    private double latitudCentro;
    private double longitudCentro;
    private double radioMetros;
    private String creadoPorCedulaCapataz;


    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCentroCosto() {
        return centroCosto;
    }

    public void setCentroCosto(String centroCosto) {
        this.centroCosto = centroCosto;
    }

    public double getLatitudCentro() {
        return latitudCentro;
    }

    public void setLatitudCentro(double latitudCentro) {
        this.latitudCentro = latitudCentro;
    }

    public double getLongitudCentro() {
        return longitudCentro;
    }

    public void setLongitudCentro(double longitudCentro) {
        this.longitudCentro = longitudCentro;
    }

    public double getRadioMetros() {
        return radioMetros;
    }

    public void setRadioMetros(double radioMetros) {
        this.radioMetros = radioMetros;
    }

    public String getCreadoPorCedulaCapataz() {
        return creadoPorCedulaCapataz;
    }

    public void setCreadoPorCedulaCapataz(String creadoPorCedulaCapataz) {
        this.creadoPorCedulaCapataz = creadoPorCedulaCapataz;
    }

}
