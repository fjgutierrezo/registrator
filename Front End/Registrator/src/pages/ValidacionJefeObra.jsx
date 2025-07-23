import React, { useState } from "react";
import "../styles/ValidacionJedeObra.css";

function ValidacionJefeObra() {
  const [registros, setRegistros] = useState([
    {
      id: 1,
      fecha: "2025-07-03",
      centroCosto: "CC-01",
      frente: "Frente A",
      trabajadores: [
        { nombre: "Pedro Pérez", entrada: "07:00", salida: "17:00" },
        { nombre: "Carlos Ruiz", entrada: "07:00", salida: "17:00" },
      ],
      validado: false,
    },
    {
      id: 2,
      fecha: "2025-07-03",
      centroCosto: "CC-02",
      frente: "Frente B",
      trabajadores: [
        { nombre: "Laura Gómez", entrada: "07:15", salida: "16:45" },
      ],
      validado: true,
    },
  ]);

  const [mostrarValidados, setMostrarValidados] = useState(false);
  const [detallesAbiertos, setDetallesAbiertos] = useState([]);

  // Cambiar estado de validación
  const toggleValidacion = (id) => {
    setRegistros((prev) =>
      prev.map((r) => (r.id === id ? { ...r, validado: !r.validado } : r))
    );
  };

  // Alternar apertura de detalle
  const toggleDetalle = (id) => {
    setDetallesAbiertos((prev) =>
      prev.includes(id)
        ? prev.filter((d) => d !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="validacion-page">
      <div className="validacion-card">
        <h2>Validación del Jefe de Obra</h2>

        <div className="filtro-toggle">
          <label style={{ marginRight: "0.5rem" }}>Mostrar:</label>
          <select
            value={mostrarValidados ? "validados" : "pendientes"}
            onChange={(e) =>
              setMostrarValidados(e.target.value === "validados")
            }
          >
            <option value="pendientes">Pendientes</option>
            <option value="validados">Validados</option>
          </select>
        </div>

        <table className="validacion-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Centro de Costo</th>
              <th>Frente</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {registros
              .filter((r) => r.validado === mostrarValidados)
              .map((registro) => (
                <React.Fragment key={registro.id}>
                  <tr onClick={() => toggleDetalle(registro.id)}>
                    <td>{registro.fecha}</td>
                    <td>{registro.centroCosto}</td>
                    <td>{registro.frente}</td>
                    <td>{registro.validado ? "✅ Validado" : "⏳ Pendiente"}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValidacion(registro.id);
                        }}
                      >
                        {registro.validado ? "Quitar" : "Validar"}
                      </button>
                    </td>
                  </tr>

                  {detallesAbiertos.includes(registro.id) && (
                    <tr className="detalle-row">
                      <td colSpan="5">
                        <strong>Trabajadores</strong>
                        
                        <table className="detalle-trabajadores">
  <thead>
    <tr>
      <th>Nombre y Apellido</th>
      <th>Hora Entrada</th>
      <th>Hora Salida</th>
    </tr>
  </thead>
  <tbody>
    {registro.trabajadores.map((t, i) => (
      <tr key={i}>
        <td>{t.nombre}</td>
        <td>{t.entrada}</td>
        <td>{t.salida}</td>
      </tr>
    ))}
  </tbody>
</table>

                        
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ValidacionJefeObra;
