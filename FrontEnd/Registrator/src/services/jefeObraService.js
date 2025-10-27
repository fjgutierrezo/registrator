// src/services/jefeObra.js
import axios from "axios";
axios.defaults.withCredentials = true;

/*const API = "http://localhost:8080/api/jefeobra";*/
const API="registrator.eu-north-1.elasticbeanstalk.com/api/jefeobra";

export const getPendientesJefe = async () => {
  const r = await axios.get(`${API}/pendientes`, { withCredentials: true });
  return r.data ?? [];
};

// fecha: "YYYY-MM-DD", frenteId: number
export const aprobarPaquete = async (fecha, frenteId, payload) => {
  // Tu backend expone: PUT /api/jefeobra/aprobar/{fecha}/{frenteId}
  const r = await axios.put(`${API}/aprobar/${fecha}/${frenteId}`, payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return r.data;
};
