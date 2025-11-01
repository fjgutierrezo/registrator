import axios from "axios";
axios.defaults.withCredentials = true;

/*const API_URL = "http://localhost:8080/api/frentes";*/
const API_URL="http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/api/frentes";

export const crearFrenteTrabajo = async (frenteData) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, frenteData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear frente:", error.response?.status, error.response?.data);
    throw error;
  }
};

export const obtenerFrentesTrabajo = async () => {
  try {
    const response = await axios.get(`${API_URL}/listarActivos`, {
      withCredentials: true,
    });
    return response.data ?? [];
  } catch (error) {
    console.error("Error al listar frentes:", error.response?.status, error.response?.data);
    return [];
  }
};

export const editarFrenteTrabajo = async (id, frenteData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/editar`, frenteData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al editar frente ${id}:`, error.response?.status, error.response?.data);
    throw error;
  }
};

export const actualizarEstadoFrente = async (id, tipo) => {
  try {
    const path = tipo === "finalizado" ? "finalizar" : tipo === "apagado" ? "apagar" : tipo;
    const response = await axios.put(`${API_URL}/${id}/${path}`, null, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar estado del frente ${id}:`, error.response?.status, error.response?.data);
    throw error;
  }
};

