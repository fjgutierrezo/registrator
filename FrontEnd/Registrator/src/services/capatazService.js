// src/services/capatazService.js
import axios from "axios";
axios.defaults.withCredentials = true; 

/*const API = "http://localhost:8080/api/capataz";*/
const API ="http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/api/capataz";
export const getPendientes = async () => {
  try {
    const { data } = await axios.get(`${API}/jornadas/pendientes`, { withCredentials: true });
    return data || [];
  } catch (error) {
    console.error("Error al obtener jornadas pendientes:", error.response?.status, error.response?.data);
    throw error;
  }
};

export const getValidadas = async () => {
  try {
    const { data } = await axios.get(`${API}/jornadas/validadas`, { withCredentials: true });
    return data || [];
  } catch (error) {
    console.error("Error al obtener jornadas validadas:", error.response?.status, error.response?.data);
    throw error;
  }
};

export const validarJornada = async (id, payload) => {
  try {
    const { data } = await axios.put(`${API}/jornadas/${id}/validar`, payload, { withCredentials: true });
    return data;
  } catch (error) {
    console.error(`Error al validar jornada ${id}:`, error.response?.status, error.response?.data);
    throw error;
  }
};

export const quitarValidacion = async (id) => {
  try {
    const { data } = await axios.put(`${API}/jornadas/${id}/quitarValidacion`, null, { withCredentials: true });
    return data;
  } catch (error) {
    console.error(`Error al quitar validación de jornada ${id}:`, error.response?.status, error.response?.data);
    throw error;
  }
};
