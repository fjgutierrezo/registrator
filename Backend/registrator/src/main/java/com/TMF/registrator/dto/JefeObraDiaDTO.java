package com.TMF.registrator.dto;

import java.time.LocalDate;
import java.util.List;

public class JefeObraDiaDTO {
    private LocalDate fecha;
    private List<JefeObraFrenteDTO> frentes;

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate v) { this.fecha = v; }

    public List<JefeObraFrenteDTO> getFrentes() { return frentes; }
    public void setFrentes(List<JefeObraFrenteDTO> v) { this.frentes = v; }
}
