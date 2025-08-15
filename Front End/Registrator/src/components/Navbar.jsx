import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { ThemeContext } from "../utils/ThemeContext";
import "../styles/Navbar.css";

function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const { modoOscuro, toggleTema } = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!usuario) return null;

  const rutas = {
    rrhh: [
      { path: "/nomina", label: "Nómina" },
      { path: "/registro-empleado", label: "Registro de Empleados" },
      { path: "/lista-empleados", label: "Ver Empleados" },
    ],
    trabajador: [{ path: "/registro-diario", label: "Registro Diario" }],
    capataz: [
      { path: "/control-diario", label: "Control Diario" },
      { path: "/crear-frente", label: "Crear Frente" },
      { path: "/trabajador-frente", label: "Registrar Trabajador" }, 
    ],
    
    jefe: [{ path: "/validacion-jefe", label: "Validación" }],
  };

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/Logo.png" alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-center">
        {(rutas[usuario.rol] || []).map((ruta) => (
          <Link key={ruta.path} to={ruta.path}>
            {ruta.label}
          </Link>
        ))}
      </div>
      <div className="navbar-right">
        <button onClick={toggleTema} className="theme-btn">
          {modoOscuro ? "☀️" : "🌙"}
        </button>
        <button onClick={cerrarSesion} className="logout-btn">
          Salir
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
