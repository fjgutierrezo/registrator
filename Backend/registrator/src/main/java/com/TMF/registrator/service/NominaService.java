package com.TMF.registrator.service;

import com.TMF.registrator.dto.NominaCalculoDetalleDTO;
import com.TMF.registrator.dto.NominaCalculoResumenDTO;
import com.TMF.registrator.model.AprobacionEstado;
import com.TMF.registrator.model.Jornada;
import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.nomina.NominaRules;
import com.TMF.registrator.repository.JornadaRepository;
import com.TMF.registrator.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

import static com.TMF.registrator.nomina.NominaRules.*;

@Service
public class NominaService {

    private final JornadaRepository jornadaRepository;
    private final UsuarioRepository usuarioRepository;

    public NominaService(JornadaRepository jornadaRepository, UsuarioRepository usuarioRepository) {
        this.jornadaRepository = jornadaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<NominaCalculoResumenDTO> resumenMensual(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate i = ym.atDay(1);
        LocalDate f = ym.atEndOfMonth();
        List<Jornada> jList = jornadaRepository.findByFechaBetweenAndAprobacionEstado(i, f, AprobacionEstado.APROBADO_JEFE);

        Map<String, List<Jornada>> porCedula = jList.stream().collect(Collectors.groupingBy(Jornada::getCedulaTrabajador));
        List<NominaCalculoResumenDTO> out = new ArrayList<>();

        for (var entry : porCedula.entrySet()) {
            String cedula = entry.getKey();
            List<Jornada> jornadas = entry.getValue();

            Usuario u = usuarioRepository.findByCedula(cedula).orElse(null);
            if (u == null) continue;

            BigDecimal salario = default0(u.getSalario());
            BigDecimal auxTrans = default0(u.getAuxilioTransporte());
            boolean aplicaAux = salario.compareTo(NominaRules.SMLMV.multiply(new BigDecimal("2"))) <= 0;

            long dias = jornadas.stream().map(Jornada::getFecha).filter(Objects::nonNull).distinct().count();

            BigDecimal salarioDia = salario.divide(new BigDecimal("30"), 6, BigDecimal.ROUND_HALF_UP);
            BigDecimal salarioProp = salarioDia.multiply(new BigDecimal(dias)); // salario por días trabajados
            BigDecimal auxProp = aplicaAux
                    ? auxTrans.divide(new BigDecimal("30"), 6, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal(dias))
                    : BigDecimal.ZERO;

            // TODO: lógica real de extras/recargos
            BigDecimal[] extrasYRecargos = calcularExtrasYRecargos(jornadas, salario);
            BigDecimal extras = extrasYRecargos[0];
            BigDecimal recargos = extrasYRecargos[1];

            BigDecimal devengado = salarioProp.add(auxProp).add(extras).add(recargos);

            // ==== NUEVO: Deducciones sobre IBC proporcional (sin auxilio) ====
            BigDecimal ibcTrab = salarioProp.add(extras).add(recargos); // <- base de cotización del trabajador
            BigDecimal saludTrab = ibcTrab.multiply(SALUD_TRAB);
            BigDecimal pensionTrab = ibcTrab.multiply(PENSION_TRAB);
            BigDecimal deducciones = saludTrab.add(pensionTrab);

            NominaCalculoResumenDTO dto = new NominaCalculoResumenDTO();
            dto.setCedula(cedula);
            dto.setNombreCompleto(u.getPrimerNombre() + " " + u.getPrimerApellido());
            dto.setDiasTrabajados(dias);
            dto.setDevengado(NominaRules.round2(devengado));
            dto.setDeducciones(NominaRules.round2(deducciones));
            dto.setNetoAPagar(NominaRules.round2(devengado.subtract(deducciones)));
            dto.setSalarioBase(NominaRules.round2(salario));
            dto.setAuxTransporteProporcional(NominaRules.round2(auxProp));
            out.add(dto);
        }

        out.sort(Comparator.comparing(NominaCalculoResumenDTO::getNombreCompleto));
        return out;
    }


    public NominaCalculoDetalleDTO detalleEmpleadoMensual(String cedula, int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate i = ym.atDay(1);
        LocalDate f = ym.atEndOfMonth();

        List<Jornada> jornadas = jornadaRepository.findByCedulaTrabajadorAndFechaBetweenAndAprobacionEstadoOrderByFechaAsc(
                cedula, i, f, AprobacionEstado.APROBADO_JEFE);

        Usuario u = usuarioRepository.findByCedula(cedula).orElse(null);
        if (u == null) return new NominaCalculoDetalleDTO();

        BigDecimal salario = default0(u.getSalario());
        BigDecimal auxTrans = default0(u.getAuxilioTransporte());
        boolean aplicaAux = salario.compareTo(NominaRules.SMLMV.multiply(new BigDecimal("2"))) <= 0;

        long dias = jornadas.stream().map(Jornada::getFecha).filter(Objects::nonNull).distinct().count();

        BigDecimal salarioDia = salario.divide(new BigDecimal("30"), 6, BigDecimal.ROUND_HALF_UP);
        BigDecimal salarioProp = salarioDia.multiply(new BigDecimal(dias));
        BigDecimal auxProp = aplicaAux
                ? auxTrans.divide(new BigDecimal("30"), 6, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal(dias))
                : BigDecimal.ZERO;

        // TODO: lógica real de extras/recargos
        BigDecimal[] arr = calcularExtrasYRecargosDetallado(jornadas, salario);
        BigDecimal extraD = arr[0], extraN = arr[1], extraDD = arr[2], extraDN = arr[3], recNoct = arr[4], recDom = arr[5];

        BigDecimal devengado = salarioProp.add(auxProp)
                .add(extraD).add(extraN).add(extraDD).add(extraDN)
                .add(recNoct).add(recDom);

        // ==== NUEVO: Deducciones sobre IBC proporcional (sin auxilio) ====
        BigDecimal ibcTrab = salarioProp.add(extraD).add(extraN).add(extraDD).add(extraDN).add(recNoct).add(recDom);
        BigDecimal saludTrab = ibcTrab.multiply(SALUD_TRAB);
        BigDecimal pensionTrab = ibcTrab.multiply(PENSION_TRAB);
        BigDecimal deduc = saludTrab.add(pensionTrab);

        // Empleador (informativo): si quieres, también sobre IBC proporcional
        BigDecimal saludEmp = ibcTrab.multiply(SALUD_EMP);
        BigDecimal pensionEmp = ibcTrab.multiply(PENSION_EMP);
        BigDecimal caja = ibcTrab.multiply(CAJA);
        BigDecimal sena = ibcTrab.multiply(SENA);
        BigDecimal icbf = ibcTrab.multiply(ICBF);
        BigDecimal arl = ibcTrab.multiply(ARL_MIN);

        // Prestaciones (como lo tenías)
        BigDecimal basePrest = salarioProp.add(auxProp).add(extraD).add(extraN).add(extraDD).add(extraDN).add(recNoct).add(recDom);
        BigDecimal cesantiasMes = basePrest.multiply(CESANTIAS_ANUAL).divide(new BigDecimal("12"), 6, BigDecimal.ROUND_HALF_UP);
        BigDecimal interesesCesMes = cesantiasMes.multiply(INTERESES_CESANTIAS_ANUAL).divide(new BigDecimal("12"), 6, BigDecimal.ROUND_HALF_UP);
        BigDecimal primaMes = basePrest.multiply(PRIMA_ANUAL).divide(new BigDecimal("12"), 6, BigDecimal.ROUND_HALF_UP);
        BigDecimal vacacionesMes = salarioProp.multiply(VACACIONES_ANUAL).divide(new BigDecimal("12"), 6, BigDecimal.ROUND_HALF_UP);

        NominaCalculoDetalleDTO d = new NominaCalculoDetalleDTO();
        d.salarioProporcional = NominaRules.round2(salarioProp);
        d.auxTransporteProporcional = NominaRules.round2(auxProp);
        d.extrasDiurnas = NominaRules.round2(extraD);
        d.extrasNocturnas = NominaRules.round2(extraN);
        d.extrasDomDiurnas = NominaRules.round2(extraDD);
        d.extrasDomNocturnas = NominaRules.round2(extraDN);
        d.recargosNocturnos = NominaRules.round2(recNoct);
        d.recargosDomFest = NominaRules.round2(recDom);

        d.saludTrab = NominaRules.round2(saludTrab);
        d.pensionTrab = NominaRules.round2(pensionTrab);

        d.saludEmp = NominaRules.round2(saludEmp);
        d.pensionEmp = NominaRules.round2(pensionEmp);
        d.caja = NominaRules.round2(caja);
        d.sena = NominaRules.round2(sena);
        d.icbf = NominaRules.round2(icbf);
        d.arl = NominaRules.round2(arl);

        d.cesantiasMes = NominaRules.round2(cesantiasMes);
        d.interesesCesantiasMes = NominaRules.round2(interesesCesMes);
        d.primaMes = NominaRules.round2(primaMes);
        d.vacacionesMes = NominaRules.round2(vacacionesMes);

        d.devengado = NominaRules.round2(devengado);
        d.deducciones = NominaRules.round2(deduc);
        d.neto = NominaRules.round2(devengado.subtract(deduc));
        return d;
    }


    // ===== Helpers =====

    private static BigDecimal default0(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }

    private static BigDecimal[] calcularExtrasYRecargos(List<Jornada> jornadas, BigDecimal salario) {
        // TODO: Reemplazar por lógica real
        return new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO};
    }

    private static BigDecimal[] calcularExtrasYRecargosDetallado(List<Jornada> jornadas, BigDecimal salario) {
        // TODO: Reemplazar por lógica real
        return new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO};
    }
}
