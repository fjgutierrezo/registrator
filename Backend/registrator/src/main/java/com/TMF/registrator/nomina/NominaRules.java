package com.TMF.registrator.nomina;

import java.math.BigDecimal;

public class NominaRules {

    // Parametrizables (ponlos en BD / application.yml en producción)
    public static BigDecimal SMLMV = new BigDecimal("1300000.00");
    public static BigDecimal AUX_TRANSPORTE_MENSUAL = new BigDecimal("162000.00");

    // Aportes trabajador
    public static final BigDecimal SALUD_TRAB = bd("0.04");
    public static final BigDecimal PENSION_TRAB = bd("0.04");

    // Aportes empleador (informativos)
    public static final BigDecimal SALUD_EMP = bd("0.085");
    public static final BigDecimal PENSION_EMP = bd("0.12");
    public static final BigDecimal CAJA = bd("0.04");
    public static final BigDecimal SENA = bd("0.02");
    public static final BigDecimal ICBF = bd("0.03");
    public static final BigDecimal ARL_MIN = bd("0.00522"); // riesgo I

    // Prestaciones (prorrateadas mensual)
    public static final BigDecimal CESANTIAS_ANUAL = bd("0.0833");
    public static final BigDecimal INTERESES_CESANTIAS_ANUAL = bd("0.12");
    public static final BigDecimal PRIMA_ANUAL = bd("0.0833");
    public static final BigDecimal VACACIONES_ANUAL = bd("0.0417");

    // Multiplicadores
    public static final BigDecimal EXTRA_DIURNA = bd("1.25");
    public static final BigDecimal EXTRA_NOCTURNA = bd("1.75");
    public static final BigDecimal EXTRA_DOM_DIURNA = bd("2.00");
    public static final BigDecimal EXTRA_DOM_NOCTURNA = bd("2.50");

    public static final BigDecimal RECARGO_NOCTURNO = bd("1.35"); // si NO es extra
    public static final BigDecimal RECARGO_DOM_FEST = bd("1.75"); // si NO es extra

    public static final BigDecimal HORAS_MES = bd("240"); // 8h * 30d

    public static BigDecimal bd(String s) { return new BigDecimal(s); }

    /** Redondeo a 2 decimales sin usar RoundingMode (evita el import) */
    public static BigDecimal round2(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v.setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}
