// src/services/nominaService.js
import axios from "axios";

// Si ya usas cookies/sesiones con Spring Security:
axios.defaults.withCredentials = true;

/*const API = "http://localhost:8080/api/rrhh/nomina";*/
const API = "http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/rrhh/nomina";

/**
 * ✅ Resumen mensual con valores (devengado, deducciones, neto) por empleado.
 * GET /api/rrhh/nomina/calculo/resumen?year=YYYY&month=MM
 */
export const obtenerNominaResumen = async (year, month) => {
  try {
    const { data } = await axios.get(`${API}/calculo/resumen`, {
      params: { year, month },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error al obtener resumen de nómina:", error.response?.status, error.response?.data);
    throw error;
  }
};

/**
 * ✅ Detalle de jornadas aprobadas (tabla por día) para el modal inferior.
 * GET /api/rrhh/nomina/detalle/{cedula}?year=YYYY&month=MM
 */
export const obtenerNominaDetalle = async (cedula, year, month) => {
  try {
    const { data } = await axios.get(`${API}/detalle/${encodeURIComponent(cedula)}`, {
      params: { year, month },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error(`Error al obtener detalle de nómina del empleado ${cedula}:`, error.response?.status, error.response?.data);
    throw error;
  }
};

/**
 * ✅ Detalle prestacional (devengados, deducciones, aportes, prestaciones) para el modal.
 * GET /api/rrhh/nomina/calculo/detalle/{cedula}?year=YYYY&month=MM
 */
export const obtenerNominaDetallePrestacional = async (cedula, year, month) => {
  try {
    const { data } = await axios.get(`${API}/calculo/detalle/${encodeURIComponent(cedula)}`, {
      params: { year, month },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error(`Error al obtener detalle prestacional del empleado ${cedula}:`, error.response?.status, error.response?.data);
    throw error;
  }
};

// (opcional) export default por si prefieres importar por default
export default {
  obtenerNominaResumen,
  obtenerNominaDetalle,
  obtenerNominaDetallePrestacional,
};
