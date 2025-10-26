// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { ThemeContext } from "../utils/ThemeContext";
import { loginUsuario } from "../services/authService";
import "../styles/Login.css";

function Login() {
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const { modoOscuro, toggleTema } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cedula || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      // Espera: { message, usuario: { id, email, cedula, rol, nombreCompleto } }
      const data = await loginUsuario(cedula, password);
      const u = data?.usuario;

      if (!u) {
        setError(data?.error || "Respuesta inesperada del servidor.");
        return;
      }

      // Normalizamos rol para el front
      const rolNorm = (u.rol || "").toLowerCase().replace(/\s+/g, "_");

      // Guardar en AuthContext lo que usas en el resto de la app
      login({
        id: u.id,
        nombre: u.nombreCompleto,
        rol: rolNorm,            // p.ej. "capataz", "jefe_obra", "trabajador"
        cedula: u.cedula,
        email: u.email || "",
      });

      // Rutas según rol (ajusta si tus paths exactos difieren)
      const rutas = {
        trabajador: "/registro-diario",
        capataz: "/control-diario-pendiente",  // ojo: en tu ejemplo tenías "Pendiente" con mayúscula
        jefe_obra: "/validacion-jefe",
        jefe: "/validacion-jefe",         // alias por si viene "Jefe"
        rrhh: "/nomina",
        recursos_humanos: "/nomina",
      };

      const destino = rutas[rolNorm] || "/";
      navigate(destino);
    } catch (err) {
      // authService lanza Error con .message ya amigable
      setError(err?.message || "No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-theme-toggle">
        <button onClick={toggleTema}>{modoOscuro ? "☀️" : "🌙"}</button>
      </div>

      <div className="login-card">
        <img src="/Logo.png" alt="Registrator Logo" className="login-logo" />
        <h2>Iniciar Sesión</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Cédula:</label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ej: 1234567890"
            required
          />

          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
