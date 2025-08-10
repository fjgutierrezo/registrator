import axios from "axios";

const API_URL = "http://localhost:8080/api/frentes";

export const crearFrenteTrabajo = async (frenteData) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, frenteData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el frente:", error);
    throw error;
  }
};

export const obtenerFrentesTrabajo = async () => {
  try {
    const response = await axios.get(`${API_URL}/listarActivos`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error al obtener frentes:", error);
    throw error;
  }
};

export const actualizarEstadoFrente = async (id, nuevoEstado) => {
  try {
    let url = "";
    if (nuevoEstado === "finalizado") {
      url = `${API_URL}/${id}/finalizar`;
    } else if (nuevoEstado === "apagado") {
      url = `${API_URL}/${id}/apagar`;
    } else {
      throw new Error("Estado inválido para actualizar frente");
    }

    const response = await axios.put(url, null, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar estado del frente:", error);
    throw error;
  }
};

// (Opcional) Búsqueda directa en backend
export const buscarFrentesPorNombreOID = async (termino) => {
  try {
    const response = await axios.get(`${API_URL}/buscar`, {
      params: { termino },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error en la búsqueda de frentes:", error);
    throw error;
  }
};

export const editarFrenteTrabajo = async (id, frenteData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/editar`, frenteData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al editar el frente:", error);
    throw error;
  }
};
