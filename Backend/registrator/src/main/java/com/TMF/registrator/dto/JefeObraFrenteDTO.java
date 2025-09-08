package com.TMF.registrator.dto;

import java.util.List;

public class JefeObraFrenteDTO {
    private Long frenteId;
    private String nombreFrente;
    private String centroCosto;
    private List<JefeObraTrabajadorDTO> trabajadores;

    public Long getFrenteId() { return frenteId; }
    public void setFrenteId(Long v) { this.frenteId = v; }

    public String getNombreFrente() { return nombreFrente; }
    public void setNombreFrente(String v) { this.nombreFrente = v; }

    public String getCentroCosto() { return centroCosto; }
    public void setCentroCosto(String v) { this.centroCosto = v; }

    public List<JefeObraTrabajadorDTO> getTrabajadores() { return trabajadores; }
    public void setTrabajadores(List<JefeObraTrabajadorDTO> v) { this.trabajadores = v; }
}
