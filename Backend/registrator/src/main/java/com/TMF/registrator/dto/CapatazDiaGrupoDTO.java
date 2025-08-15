package com.TMF.registrator.dto;

import java.time.LocalDate;
import java.util.List;

public class CapatazDiaGrupoDTO {
    private LocalDate fecha;
    private List<CapatazJornadaItemDTO> trabajadores;

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate f) { this.fecha = f; }

    public List<CapatazJornadaItemDTO> getTrabajadores() { return trabajadores; }
    public void setTrabajadores(List<CapatazJornadaItemDTO> t) { this.trabajadores = t; }
}
