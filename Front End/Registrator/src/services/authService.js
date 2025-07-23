// src/services/authService.js
import axios from "axios";

export const loginUsuario = async (cedula, password) => {
  const response = await axios.post("http://localhost:8080/api/login", {
    cedula,
    password,
  });
  return response.data;
};
