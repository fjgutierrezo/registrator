// src/services/trabajadorFrenteService.js
import axios from "axios";
axios.defaults.withCredentials = true; 

/*const API_URL = "http://localhost:8080/api/trabajadorEnFrente";*/
const API_URL="registrator.eu-north-1.elasticbeanstalk.com/api/trabajadorEnFrente";

// 📌 Obtiene todos los trabajadores asignados a un frente específico
export const listarTrabajadoresPorFrente = async (frenteId) => {
  try {
    const response = await axios.get(`${API_URL}/listarPorFrente/${frenteId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al listar trabajadores por frente:", error);
    throw error;
  }
};

// 📌 Asigna un trabajador a un frente
export const asignarTrabajadorAFrente = async (trabajador) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, trabajador, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al asignar trabajador:", error);
    throw error;
  }
};

// 📌 Elimina un trabajador asignado de un frente
export const eliminarTrabajadorDeFrente = async (trabajadorId) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar/${trabajadorId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar trabajador del frente:", error);
    throw error;
  }
};
export const listarFrentesPorCedula = async (cedula) => {
  const res = await axios.get(`${API_URL}/listarPorCedula/${cedula}`, { withCredentials: true });
  return res.data; // lista de TrabajadorEnFrente con frenteTrabajo embebido
};

