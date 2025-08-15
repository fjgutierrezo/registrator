package com.TMF.registrator.dto;

public class JornadaSalidaRequest {
    private Double lat;
    private Double lng;
    private Double accuracy;
    private String horaClienteISO;
    private String observacion;

    // getters/setters...
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
    public String getHoraClienteISO() { return horaClienteISO; }
    public void setHoraClienteISO(String horaClienteISO) { this.horaClienteISO = horaClienteISO; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
}
