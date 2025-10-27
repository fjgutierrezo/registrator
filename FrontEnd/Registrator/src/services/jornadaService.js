// src/services/jornadaService.js
import axios from "axios";
axios.defaults.withCredentials = true; 

/*const API_URL = "http://localhost:8080/api/jornadas";*/
const API_URL="http://registrator.eu-north-1.elasticbeanstalk.com/api/jornadas";

export const getActiva = async (cedula, frenteId) => {
  const res = await axios.get(`${API_URL}/activas`, {
    params: { cedula, frenteId },
    withCredentials: true,
  });
  // Si no hay contenido, axios no lanza error, pero podrías devolver null
  return res.data || null;
};

export const crearEntrada = async ({ cedula, frenteTrabajoId, lat, lng, accuracy, horaClienteISO, observacion, files }) => {
  const form = new FormData();
  form.append("data", new Blob([JSON.stringify({ cedula, frenteTrabajoId, lat, lng, accuracy, horaClienteISO, observacion })], { type: "application/json" }));
  if (files && files.length) {
    for (const f of files) form.append("files", f);
  }
  const res = await axios.post(`${API_URL}/entrada`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data; // { jornadaId, horaEntradaServidor, horaEntradaCliente }
};

export const registrarSalida = async (jornadaId, { lat, lng, accuracy, horaClienteISO, observacion, files }) => {
  const form = new FormData();
  form.append("data", new Blob([JSON.stringify({ lat, lng, accuracy, horaClienteISO, observacion })], { type: "application/json" }));
  if (files && files.length) {
    for (const f of files) form.append("files", f);
  }
  const res = await axios.put(`${API_URL}/${jornadaId}/salida`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data; // { ok: true }
};
export const getDelDia = async (cedula) => {
    const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
    // si decides hacer un endpoint específico, puedes usar /api/jornadas/dia?cedula=&fecha=
    // De momento, reusamos la validación por error en /entrada y mostramos estado si existe
    try {
      const res = await axios.get("http://localhost:8080/api/jornadas/activas", {
        params: { cedula, frenteId: 0 }, // frenteId dummy si tu endpoint lo exige; puedes crear un /dia
        withCredentials: true,
      });
      return res.data || null;
    } catch {
      return null;
    }
  };
  export const getActivaPorCedula = async (cedula) => {
    try {
      const res = await axios.get(`${API_URL}/activaPorCedula`, {
        params: { cedula },
        withCredentials: true,
      });
      return res.data || null;
    } catch {
      return null;
    }
  };
  