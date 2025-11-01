// src/services/trabajadorFrenteService.js
import axios from "axios";
axios.defaults.withCredentials = true; 

/*const API_URL = "http://localhost:8080/api/trabajadorEnFrente";*/
const API_URL = "http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/api/trabajadorEnFrente";

// 📌 Obtiene todos los trabajadores asignados a un frente específico
export const listarTrabajadoresPorFrente = async (frenteId) => {
  try {
    const response = await axios.get(`${API_URL}/listarPorFrente/${frenteId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error al listar trabajadores del frente ${frenteId}:`,
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};

// 📌 Asigna un trabajador a un frente
export const asignarTrabajadorAFrente = async (trabajador) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, trabajador, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al asignar trabajador al frente:",
      error.response?.status,
      error.response?.data
    );
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
    console.error(
      `Error al eliminar trabajador ${trabajadorId} del frente:`,
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};

// 📌 Lista los frentes a los que pertenece una cédula específica
export const listarFrentesPorCedula = async (cedula) => {
  try {
    const res = await axios.get(`${API_URL}/listarPorCedula/${cedula}`, {
      withCredentials: true,
    });
    return res.data; // lista de TrabajadorEnFrente con frenteTrabajo embebido
  } catch (error) {
    console.error(
      `Error al listar frentes para la cédula ${cedula}:`,
      error.response?.status,
      error.response?.data
    );
    return [];
  }
};
