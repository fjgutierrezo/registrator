import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    // 🔹 Intenta restaurar el usuario desde localStorage (si existe)
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (dataUsuario) => {
    console.log("Login context:", dataUsuario);
    setUsuario(dataUsuario);
    // 🔹 Guarda en localStorage
    localStorage.setItem("usuario", JSON.stringify(dataUsuario));
  };

  const logout = () => {
    setUsuario(null);
    // 🔹 Limpia el storage al cerrar sesión
    localStorage.removeItem("usuario");
  };

  // 🔹 (opcional) sincroniza cambios del usuario con el storage
  useEffect(() => {
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
  }, [usuario]);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
