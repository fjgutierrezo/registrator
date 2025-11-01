// src/services/jefeObra.js
import axios from "axios";
axios.defaults.withCredentials = true;

/*const API = "http://localhost:8080/api/jefeobra";*/
const API="http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/api/jefeobra";

export const getPendientesJefe = async () => {
  try {
    const r = await axios.get(`${API}/pendientes`, { withCredentials: true });
    return r.data ?? [];
  } catch (error) {
    console.error("Error al obtener pendientes del jefe de obra:", error.response?.status, error.response?.data);
    throw error;
  }
};

// fecha: "YYYY-MM-DD", frenteId: number
export const aprobarPaquete = async (fecha, frenteId, payload) => {
  try {
    const r = await axios.put(`${API}/aprobar/${fecha}/${frenteId}`, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return r.data;
  } catch (error) {
    console.error(`Error al aprobar paquete (${fecha}, ${frenteId}):`, error.response?.status, error.response?.data);
    throw error;
  }
};
