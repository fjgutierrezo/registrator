// src/services/employeeService.js
import axios from 'axios';

// Cambia esta URL base si tu backend está en otra dirección
const API_BASE_URL = 'http://localhost:8080/rrhh/empleados';

const employeeService = {
  // Obtener todos los empleados
  getAll: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  // Buscar un empleado por cédula
  getByCedula: async (cedula) => {
    const response = await axios.get(`${API_BASE_URL}/${cedula}`);
    return response.data;
  },

  // Registrar un nuevo empleado
  create: async (empleado) => {
    const response = await axios.post(API_BASE_URL, empleado);
    return response.data;
  },

  // Actualizar un empleado existente (por Cedula)
  update: async (cedula, empleado) => {
    const response = await axios.put(`${API_BASE_URL}/${cedula}`, empleado);
    return response.data;
  },

  // Eliminar un empleado (por ID)
  remove: async (cedula) => {
    const response = await axios.delete(`${API_BASE_URL}/${cedula}`);
    return response.data;
  },
};

export default employeeService;
