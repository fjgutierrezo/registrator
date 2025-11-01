import axios from "axios";
 axios.defaults.withCredentials = true;

export async function loginUsuario(cedula, password) {
  try {
    const res = await axios.post(
      "http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/auth/login",
      { cedula, password },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );

    // ✅ Verificación opcional
    if (!res.data) throw new Error("Respuesta vacía del servidor");

    return res.data;

  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.error || "Error de login");
    }
    throw new Error("No se pudo conectar con el servidor");
  }
}
