// src/services/capatazService.js
import axios from "axios";

const API = "http://localhost:8080/api/capataz";

export const getPendientes = async () => {
  const { data } = await axios.get(`${API}/jornadas/pendientes`, { withCredentials: true });
  return data || [];
};

export const getValidadas = async () => {
  const { data } = await axios.get(`${API}/jornadas/validadas`, { withCredentials: true });
  return data || [];
};

export const validarJornada = async (id, payload) => {
  // payload: { aprobadoPorCedula, aprobadoPorNombre, [horaEntradaEditadaISO], [horaSalidaEditadaISO], [motivoEdicion] }
  const { data } = await axios.put(`${API}/jornadas/${id}/validar`, payload, { withCredentials: true });
  return data;
};

export const quitarValidacion = async (id) => {
  const { data } = await axios.put(`${API}/jornadas/${id}/quitarValidacion`, null, { withCredentials: true });
  return data;
};
