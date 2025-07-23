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

    if (!cedula || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const data = await loginUsuario(cedula, password);

      if (data.success) {
        login({
          nombre: data.nombre,
          rol: data.rol.toLowerCase(),
          cedula: data.cedula,
        });

        const rutas = {
          trabajador: "/registro-diario",
          capataz: "/control-diario",
          jefe: "/validacion-jefe",
          rrhh: "/nomina",
        };

        navigate(rutas[data.rol.toLowerCase()]);
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
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
