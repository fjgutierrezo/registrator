import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

function RutaProtegida({ children, permitido }) {
  const { usuario } = useContext(AuthContext);

  if (!usuario || !permitido.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;
