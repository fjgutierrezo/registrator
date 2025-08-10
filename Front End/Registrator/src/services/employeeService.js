// src/services/employeeService.js
import axios from 'axios';

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

  // Actualizar un empleado existente (por Cédula)
  update: async (cedula, empleado) => {
    const response = await axios.put(`${API_BASE_URL}/${cedula}`, empleado);
    return response.data;
  },

  // Eliminar un empleado (por Cédula)
  remove: async (cedula) => {
    const response = await axios.delete(`${API_BASE_URL}/${cedula}`);
    return response.data;
  },

  // ✅ Obtener todos los trabajadores con rol "Trabajador" y frente (si aplica)
  getTrabajadoresConFrente: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data
        .filter((empleado) => empleado.rol === "Trabajador")
        .map((empleado) => ({
          cedula: empleado.cedula,
          nombreCompleto: `${empleado.primerNombre} ${empleado.segundoNombre} ${empleado.primerApellido} ${empleado.segundoApellido}`,
          frente: empleado.frenteTrabajoId || null // Este campo debe estar en el backend si el trabajador ya está asignado
        }));
    } catch (error) {
      console.error("Error al obtener trabajadores con frente:", error);
      return [];
    }
  }
};

export default employeeService;
