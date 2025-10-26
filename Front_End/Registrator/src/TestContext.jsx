import React, { useContext } from "react";
import { AuthContext } from "./utils/AuthContext";

function TestContext() {
  const { perfil, usuario, login, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>🧪 Prueba de múltiples roles desde el contexto</h2>
      <p><strong>Perfil:</strong> {perfil || "Ninguno"}</p>
      <p><strong>Usuario:</strong> {usuario || "Anónimo"}</p>
      <button onClick={() => login("rrhh", "Laura RH")}>Login como RRHH</button>
      <button onClick={() => login("capataz", "Carlos Capataz")}>Login como Capataz</button>
      <button onClick={() => login("jefe", "Jorge Jefe")}>Login como Jefe</button>
      <button onClick={() => login("trabajador", "Pedro Trabajador")}>Login como Trabajador</button>
      <button onClick={logout} style={{ backgroundColor: "red", color: "white" }}>Cerrar sesión</button>
    </div>
  );
}

export default TestContext;
