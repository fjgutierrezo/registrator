import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import RegistroEmpleado from "./pages/RegistroEmpleado";
import RegistroDiario from "./pages/RegistroDiario";
import ControlDiario from "./pages/ControlDiario";
import ValidacionJefeObra from "./pages/ValidacionJefeObra";
import NominaRRHH from "./pages/NominaRRHH";
import ListaEmpleados from "./pages/ListaEmpleados";
import CrearFrente from "./pages/CrearFrente";
import RutaProtegida from "./components/RutaProtegida";
import LayoutProtegido from "./components/LayoutProtegido";
import AsignarTrabajadores from "./pages/AsignarTrabajadores";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas con Navbar */}
        <Route element={<LayoutProtegido />}>
          <Route
            path="/registro-empleado"
            element={
              <RutaProtegida permitido={["rrhh"]}>
                <RegistroEmpleado />
              </RutaProtegida>
            }
          />
          <Route
            path="/registro-diario"
            element={
              <RutaProtegida permitido={["trabajador"]}>
                <RegistroDiario />
              </RutaProtegida>
            }
          />
          <Route
            path="/control-diario"
            element={
              <RutaProtegida permitido={["capataz"]}>
                <ControlDiario />
              </RutaProtegida>
            }
          />
          <Route
            path="/validacion-jefe"
            element={
              <RutaProtegida permitido={["jefe"]}>
                <ValidacionJefeObra />
              </RutaProtegida>
            }
          />
          <Route
            path="/nomina"
            element={
              <RutaProtegida permitido={["rrhh"]}>
                <NominaRRHH />
              </RutaProtegida>
            }
          />
          <Route
            path="/lista-empleados"
            element={
              <RutaProtegida permitido={["rrhh"]}>
                <ListaEmpleados />
              </RutaProtegida>
            }
          />
          <Route 
            path="/crear-frente" 
            element={
            <RutaProtegida permitido={["capataz"]}>
                <CrearFrente />
            </RutaProtegida>
            } 
          />
          <Route 
            path="/trabajador-frente" 
            element={
            <RutaProtegida permitido={["capataz"]}>
                <AsignarTrabajadores/>
            </RutaProtegida>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
