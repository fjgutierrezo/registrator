import axios from "axios";

const API_URL = "http://localhost:8080/api/frentes";

export const crearFrenteTrabajo = async (frenteData) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, frenteData, {
      withCredentials: true, // ✅ obligatorio si el backend usa allowCredentials(true)
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el frente:", error);
    throw error;
  }
};
