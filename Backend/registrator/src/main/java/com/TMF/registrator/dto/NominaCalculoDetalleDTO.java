// src/main/java/com/TMF/registrator/dto/NominaCalculoDetalleDTO.java
package com.TMF.registrator.dto;

import java.math.BigDecimal;

public class NominaCalculoDetalleDTO {
    // Totales por mes (acumulado hasta hoy)
    public BigDecimal salarioProporcional;
    public BigDecimal auxTransporteProporcional;
    public BigDecimal extrasDiurnas;
    public BigDecimal extrasNocturnas;
    public BigDecimal extrasDomDiurnas;
    public BigDecimal extrasDomNocturnas;
    public BigDecimal recargosNocturnos;
    public BigDecimal recargosDomFest;

    // Deducciones trabajador
    public BigDecimal saludTrab;
    public BigDecimal pensionTrab;

    // Aportes empleador (informativo)
    public BigDecimal saludEmp;
    public BigDecimal pensionEmp;
    public BigDecimal caja;
    public BigDecimal sena;
    public BigDecimal icbf;
    public BigDecimal arl;

    // Prestaciones prorrateadas mensual (informativo)
    public BigDecimal cesantiasMes;
    public BigDecimal interesesCesantiasMes;
    public BigDecimal primaMes;
    public BigDecimal vacacionesMes;

    public BigDecimal devengado;
    public BigDecimal deducciones;
    public BigDecimal neto;
}
