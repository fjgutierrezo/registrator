// src/services/jornadaService.js
import axios from "axios";
axios.defaults.withCredentials = true; 

// const API_URL = "http://localhost:8080/api/jornadas";
const API_URL = "http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/api/jornadas";

// ✅ Obtener jornada activa por cédula y frente
export const getActiva = async (cedula, frenteId) => {
  try {
    const res = await axios.get(`${API_URL}/activas`, {
      params: { cedula, frenteId },
      withCredentials: true,
    });
    return res.data || null;
  } catch (error) {
    console.error("Error al obtener jornada activa:", error.response?.status, error.response?.data);
    return null;
  }
};

// ✅ Registrar entrada con archivos y geolocalización
export const crearEntrada = async ({ cedula, frenteTrabajoId, lat, lng, accuracy, horaClienteISO, observacion, files }) => {
  try {
    const form = new FormData();
    form.append(
      "data",
      new Blob(
        [JSON.stringify({ cedula, frenteTrabajoId, lat, lng, accuracy, horaClienteISO, observacion })],
        { type: "application/json" }
      )
    );

    if (files && files.length) {
      for (const f of files) form.append("files", f);
    }

    const res = await axios.post(`${API_URL}/entrada`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return res.data; // { jornadaId, horaEntradaServidor, horaEntradaCliente }

  } catch (error) {
    console.error("Error al registrar entrada:", error.response?.status, error.response?.data);
    throw error;
  }
};

// ✅ Registrar salida con archivos y geolocalización
export const registrarSalida = async (jornadaId, { lat, lng, accuracy, horaClienteISO, observacion, files }) => {
  try {
    const form = new FormData();
    form.append(
      "data",
      new Blob(
        [JSON.stringify({ lat, lng, accuracy, horaClienteISO, observacion })],
        { type: "application/json" }
      )
    );

    if (files && files.length) {
      for (const f of files) form.append("files", f);
    }

    const res = await axios.put(`${API_URL}/${jornadaId}/salida`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return res.data; // { ok: true }

  } catch (error) {
    console.error(`Error al registrar salida de la jornada ${jornadaId}:`, error.response?.status, error.response?.data);
    throw error;
  }
};

// ✅ Obtener jornada del día (corrigiendo endpoint local)
export const getDelDia = async (cedula) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    const res = await axios.get(`${API_URL}/activas`, {
      params: { cedula, frenteId: 0 }, // frenteId dummy si tu endpoint lo exige
      withCredentials: true,
    });
    return res.data || null;
  } catch (error) {
    console.error("Error al obtener jornada del día:", error.response?.status, error.response?.data);
    return null;
  }
};

// ✅ Obtener jornada activa solo por cédula
export const getActivaPorCedula = async (cedula) => {
  try {
    const res = await axios.get(`${API_URL}/activaPorCedula`, {
      params: { cedula },
      withCredentials: true,
    });
    return res.data || null;
  } catch (error) {
    console.error("Error al obtener jornada activa por cédula:", error.response?.status, error.response?.data);
    return null;
  }
};
