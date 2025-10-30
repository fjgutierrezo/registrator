// src/services/nominaService.js
import axios from "axios";

// Si ya usas cookies/sesiones con Spring Security:
axios.defaults.withCredentials = true;

/*const API = "http://localhost:8080/api/rrhh/nomina";*/
const API="https://registrator-env.eba-v7q5tsgm.eu-north-1.elasticbeanstalk.com/rrhh/nomina";

/**
 * Resumen mensual con valores (devengado, deducciones, neto) por empleado.
 * GET /api/rrhh/nomina/calculo/resumen?year=YYYY&month=MM
 */
export const obtenerNominaResumen = async (year, month) => {
  const { data } = await axios.get(`${API}/calculo/resumen`, {
    params: { year, month },
  });
  return data;
};

/**
 * Detalle de jornadas aprobadas (tabla por día) para el modal inferior.
 * GET /api/rrhh/nomina/detalle/{cedula}?year=YYYY&month=MM
 */
export const obtenerNominaDetalle = async (cedula, year, month) => {
  const { data } = await axios.get(`${API}/detalle/${encodeURIComponent(cedula)}`, {
    params: { year, month },
  });
  return data;
};

/**
 * Detalle prestacional (devengados, deducciones, aportes, prestaciones) para el modal.
 * GET /api/rrhh/nomina/calculo/detalle/{cedula}?year=YYYY&month=MM
 */
export const obtenerNominaDetallePrestacional = async (cedula, year, month) => {
  const { data } = await axios.get(`${API}/calculo/detalle/${encodeURIComponent(cedula)}`, {
    params: { year, month },
  });
  return data;
};

// (opcional) export default por si prefieres importar por default
export default {
  obtenerNominaResumen,
  obtenerNominaDetalle,
  obtenerNominaDetallePrestacional,
};
