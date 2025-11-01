// src/components/RutaProtegida.jsx
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import axios from "axios";

function RutaProtegida({ children, permitido }) {
  const { usuario, login } = useContext(AuthContext);
  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const checkSesion = async () => {
      try {
        // 👇 Valida si hay sesión en el backend usando la cookie JSESSIONID
        const res = await axios.get(
          "http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/auth/me",
          { withCredentials: true }
        );

        if (res.data?.rol) {
          // ✅ Reconstruimos el usuario si el contexto estaba vacío
          login({
            id: res.data.id,
            nombre: res.data.nombreCompleto,
            rol: (res.data.rol || "").toLowerCase().replace(/\s+/g, "_"),
            cedula: res.data.cedula,
            email: res.data.email || "",
          });
          setAutorizado(permitido.includes(res.data.rol.toLowerCase()));
        } else if (usuario) {
          setAutorizado(permitido.includes(usuario.rol));
        } else {
          setAutorizado(false);
        }
      } catch (error) {
        console.warn("Sesión no válida:", error.response?.status);
        setAutorizado(false);
      } finally {
        setVerificando(false);
      }
    };

    checkSesion();
  }, [usuario, permitido, login]);

  if (verificando) {
    return <div>Cargando sesión...</div>;
  }

  if (!autorizado) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;
