package com.TMF.registrator.dto;

public class JornadaEntradaRequest {
    private String cedula;
    private Long frenteTrabajoId;
    private Double lat;
    private Double lng;
    private Double accuracy; // metros (navigator.geolocation)
    private String horaClienteISO; // ISO-8601 (cliente)
    private String observacion;
    // getters/setters


    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public Long getFrenteTrabajoId() {
        return frenteTrabajoId;
    }

    public void setFrenteTrabajoId(Long frenteTrabajoId) {
        this.frenteTrabajoId = frenteTrabajoId;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public String getHoraClienteISO() {
        return horaClienteISO;
    }

    public void setHoraClienteISO(String horaClienteISO) {
        this.horaClienteISO = horaClienteISO;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}
