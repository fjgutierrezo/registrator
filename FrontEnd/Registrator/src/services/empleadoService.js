// src/services/employeeService.js
import axios from 'axios';
axios.defaults.withCredentials = true; 

/*const API_BASE_URL = 'http://localhost:8080/rrhh/empleados';*/
const API_BASE_URL="http://registraor-env.eba-23gfuipt.eu-north-1.elasticbeanstalk.com/rrhh/empleados";

const employeeService = {
  getAll: async () => {
    try {
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error al cargar empleados:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getByCedula: async (cedula) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${cedula}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error al buscar empleado:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  create: async (empleado) => {
    try {
      const response = await axios.post(API_BASE_URL, empleado, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error al registrar empleado:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  update: async (cedula, empleado) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${cedula}`, empleado, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar empleado:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  remove: async (cedula) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${cedula}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar empleado:", error.response?.status, error.response?.data);
      throw error;
    }
  },

  getTrabajadoresConFrente: async () => {
    try {
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      return response.data
        .filter((empleado) => empleado.rol === "Trabajador")
        .map((empleado) => ({
          cedula: empleado.cedula,
          nombreCompleto: `${empleado.primerNombre} ${empleado.segundoNombre} ${empleado.primerApellido} ${empleado.segundoApellido}`,
          frente: empleado.frenteTrabajoId || null
        }));
    } catch (error) {
      console.error("Error al obtener trabajadores con frente:", error.response?.status, error.response?.data);
      return [];
    }
  }
};


export default employeeService;
