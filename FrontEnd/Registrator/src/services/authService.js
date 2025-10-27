import axios from "axios";
axios.defaults.withCredentials = true; 

export async function loginUsuario(cedula, password) {
  try {
    const res = await axios.post(
      /*"http://localhost:8080/auth/login",*/
      "https://registrator.eu-north-1.elasticbeanstalk.com/auth/login",
      { cedula, password },
      {
        withCredentials: true, // 👈 mantiene la sesión (JSESSIONID)
        headers: { "Content-Type": "application/json" }
      }
    );
    return res.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.error || "Error de login");
    }
    throw new Error("No se pudo conectar con el servidor");
  }
}
