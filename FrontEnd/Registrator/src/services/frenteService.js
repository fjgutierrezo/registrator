import axios from "axios";
axios.defaults.withCredentials = true;

/*const API_URL = "http://localhost:8080/api/frentes";*/
const API_URL="http://registrator.eu-north-1.elasticbeanstalk.com/api/frentes";

// Crear frente
export const crearFrenteTrabajo = async (frenteData) => {
  const response = await axios.post(`${API_URL}/crear`, frenteData, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Listar frentes activos
export const obtenerFrentesTrabajo = async () => {
  const response = await axios.get(`${API_URL}/listarActivos`, {
    withCredentials: true,
  });
  return response.data ?? [];
};

// Editar frente
export const editarFrenteTrabajo = async (id, frenteData) => {
  const response = await axios.put(`${API_URL}/${id}/editar`, frenteData, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Cambiar estado: "finalizado" | "apagado" (UI) → "/finalizar" | "/apagar" (API)
export const actualizarEstadoFrente = async (id, tipo) => {
  const path = tipo === "finalizado" ? "finalizar" : tipo === "apagado" ? "apagar" : tipo;
  const response = await axios.put(`${API_URL}/${id}/${path}`, null, {
    withCredentials: true,
  });
  return response.data;
};
