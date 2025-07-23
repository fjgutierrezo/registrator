import { createContext, useState, useEffect } from "react";

// Creamos contexto de tema
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [modoOscuro, setModoOscuro] = useState(true); // oscuro por defecto

  const toggleTema = () => setModoOscuro((prev) => !prev);

  // Aplica la clase al body
  useEffect(() => {
    document.body.classList.toggle("theme-dark", modoOscuro);
  }, [modoOscuro]);

  return (
    <ThemeContext.Provider value={{ modoOscuro, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};
