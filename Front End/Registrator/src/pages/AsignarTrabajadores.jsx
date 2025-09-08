// src/pages/AsignarTrabajadores.jsx
import React, { useEffect, useState } from "react";
import {
  listarTrabajadoresPorFrente,
  asignarTrabajadorAFrente,
  eliminarTrabajadorDeFrente,
} from "../services/trabajadorFrenteService";
import employeeService from "../services/empleadoService";
import { obtenerFrentesTrabajo } from "../services/frenteService";
import "../styles/AsignarTrabajadores.css";

const AsignarTrabajadores = () => {
  const [filtroFrente, setFiltroFrente] = useState("");
  const [frentes, setFrentes] = useState([]);
  const [frenteSeleccionado, setFrenteSeleccionado] = useState(null);

  const [trabajadoresAsignados, setTrabajadoresAsignados] = useState([]);
  const [filtroTrabajador, setFiltroTrabajador] = useState("");
  const [trabajadoresDisponibles, setTrabajadoresDisponibles] = useState([]);

  // Cargar frentes y filtrarlos según filtroFrente
  useEffect(() => {
    const cargarFrentes = async () => {
      try {
        const todosFrentes = await obtenerFrentesTrabajo();
        const filtrados = todosFrentes.filter(
          (f) =>
            f.id.toString().includes(filtroFrente) ||
            f.nombre.toLowerCase().includes(filtroFrente.toLowerCase())
        );
        setFrentes(filtrados);
      } catch (error) {
        console.error("Error cargando frentes:", error);
      }
    };

    cargarFrentes();
  }, [filtroFrente]);

  // Cuando se selecciona un frente, cargar trabajadores asignados
  useEffect(() => {
    const cargarTrabajadoresAsignados = async () => {
      if (!frenteSeleccionado) {
        setTrabajadoresAsignados([]);
        setTrabajadoresDisponibles([]);
        return;
      }
      try {
        const asignados = await listarTrabajadoresPorFrente(frenteSeleccionado.id);
        setTrabajadoresAsignados(asignados);
      } catch (error) {
        console.error("Error cargando trabajadores asignados:", error);
        setTrabajadoresAsignados([]);
      }
    };

    cargarTrabajadoresAsignados();
  }, [frenteSeleccionado]);

  // Cargar trabajadores disponibles y filtrar por búsqueda + excluir ya asignados
  useEffect(() => {
    const cargarTrabajadoresDisponibles = async () => {
      if (!frenteSeleccionado) {
        setTrabajadoresDisponibles([]);
        return;
      }
      try {
        const todosTrabajadores = await employeeService.getTrabajadoresConFrente();

        const filtrados = todosTrabajadores.filter((t) => {
          const nombreYcedula = (t.cedula + " " + t.nombreCompleto).toLowerCase();
          const coincideFiltro = nombreYcedula.includes(filtroTrabajador.toLowerCase());
          // OJO: los asignados traen cedulaTrabajador
          const noEstaAsignado = !trabajadoresAsignados.some(
            (asig) => asig.cedulaTrabajador === t.cedula
          );
          return coincideFiltro && noEstaAsignado;
        });

        setTrabajadoresDisponibles(filtrados);
      } catch (error) {
        console.error("Error cargando trabajadores disponibles:", error);
        setTrabajadoresDisponibles([]);
      }
    };

    cargarTrabajadoresDisponibles();
  }, [filtroTrabajador, trabajadoresAsignados, frenteSeleccionado]);

  // Seleccionar frente
  const seleccionarFrente = (frente) => {
    setFrenteSeleccionado(frente);
    setFiltroTrabajador("");
  };

  // Asignar trabajador a frente
  const asignarTrabajador = async (trabajador) => {
    if (!frenteSeleccionado) {
      alert("Debe seleccionar un frente primero");
      return;
    }
    try {
      const creado = await asignarTrabajadorAFrente({
        cedula: trabajador.cedula,
        nombre: trabajador.nombreCompleto,
        rol: trabajador.rol || "Trabajador",
        frenteTrabajoId: frenteSeleccionado.id,
      });

      // Agregar el objeto devuelto por el backend (ya trae id/cedulaTrabajador/nombreTrabajador/rol)
      setTrabajadoresAsignados((prev) => [...prev, creado]);

      // Quitar de disponibles
      setTrabajadoresDisponibles((prev) =>
        prev.filter((t) => t.cedula !== trabajador.cedula)
      );
    } catch (error) {
      console.error("Error asignando trabajador:", error);
      alert("Error asignando trabajador");
    }
  };

  // Eliminar trabajador del frente
  const eliminarTrabajador = async (trabajador) => {
    try {
      await eliminarTrabajadorDeFrente(trabajador.id);

      // Sacar de la lista de asignados
      setTrabajadoresAsignados((prev) => prev.filter((t) => t.id !== trabajador.id));

      // (Opcional) Regresarlo a disponibles con el formato correcto
      setTrabajadoresDisponibles((prev) => [
        ...prev,
        {
          cedula: trabajador.cedulaTrabajador,
          nombreCompleto: trabajador.nombreTrabajador,
          rol: trabajador.rol || "Trabajador",
        },
      ]);
    } catch (error) {
      console.error("Error eliminando trabajador:", error);
      alert("Error eliminando trabajador");
    }
  };

  return (
    <div className="asignar-container">
      <div className="asignar-card">
        <h2>Buscar Frente de Trabajo</h2>
        <input
          type="text"
          placeholder="Buscar por ID o Nombre"
          value={filtroFrente}
          onChange={(e) => setFiltroFrente(e.target.value)}
          className="buscador-input"
        />
        <table className="tabla-trabajadores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {frentes.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  No hay frentes que mostrar
                </td>
              </tr>
            )}
            {frentes.map((frente) => (
              <tr
                key={frente.id}
                className={frenteSeleccionado?.id === frente.id ? "seleccionado" : ""}
              >
                <td>{frente.id}</td>
                <td>{frente.nombre}</td>
                <td>{frente.estado}</td>
                <td>
                  <button className="btn-frente" onClick={() => seleccionarFrente(frente)}>Seleccionar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {frenteSeleccionado && (
          <>
            <h3>Trabajadores Asignados al Frente "{frenteSeleccionado.nombre}"</h3>
            {trabajadoresAsignados.length === 0 ? (
              <p>No hay trabajadores asignados.</p>
            ) : (
              <table className="tabla-trabajadores">
                <thead>
                  <tr>
                    <th>Cédula</th>
                    <th>Nombre Completo</th>
                    <th>Cargo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {trabajadoresAsignados.map((trabajador) => (
                    <tr key={trabajador.id}>
                      <td>{trabajador.cedulaTrabajador}</td>
                      <td>{trabajador.nombreTrabajador}</td>
                      <td>{trabajador.rol}</td>
                      <td>
                        <button className="btn-eliminar"  onClick={() => eliminarTrabajador(trabajador)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h3>Buscar Trabajador para Asignar</h3>
            <input
                type="text"
                placeholder="Buscar por cédula o nombre"
                value={filtroTrabajador}
                onChange={(e) => setFiltroTrabajador(e.target.value)}
                className="buscador-input"
              />
            <table className="tabla-trabajadores">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre Completo</th>
                  <th>Cargo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trabajadoresDisponibles.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      No hay trabajadores disponibles
                    </td>
                  </tr>
                )}
                {trabajadoresDisponibles.map((trabajador) => (
                  <tr key={trabajador.cedula}>
                    <td>{trabajador.cedula}</td>
                    <td>{trabajador.nombreCompleto}</td>
                    <td>{trabajador.rol || "Trabajador"}</td>
                    <td>
                      <button  className="btn-asignar" onClick={() => asignarTrabajador(trabajador)}>
                        Asignar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AsignarTrabajadores;
