import React, { useState } from "react";
import "../styles/ControlDiario.css";

function ControlDiario() {
  // Estado simulado de registros
  const [registros, setRegistros] = useState([
    {
      id: 1,
      nombre: "Pedro Pérez",
      entrada: "07:00",
      salida: "17:00",
      centro: "CC-01",
      frente: "Frente A",
      validado: false,
    },
    {
      id: 2,
      nombre: "Laura Gómez",
      entrada: "07:15",
      salida: "16:45",
      centro: "CC-01",
      frente: "Frente A",
      validado: true,
    },
  ]);

  // Validar o quitar validación
  const toggleValidar = (id) => {
    setRegistros((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, validado: !r.validado } : r
      )
    );
  };

  // Editar campos directo
  const editarCampo = (id, campo, valor) => {
    setRegistros((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [campo]: valor } : r
      )
    );
  };

  return (
    <div className="control-page">
      <div className="control-card">
        <h2>Control Diario del Capataz</h2>
        <table className="control-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Frente</th>
              <th>Centro de Costo</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>
                  <input
                    type="time"
                    value={r.entrada}
                    onChange={(e) =>
                      editarCampo(r.id, "entrada", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={r.salida}
                    onChange={(e) =>
                      editarCampo(r.id, "salida", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={r.frente}
                    onChange={(e) =>
                      editarCampo(r.id, "frente", e.target.value)
                    }
                  />
                </td>
                <td>{r.centro}</td>
                <td>
                  {r.validado ? "✅ Validado" : "⏳ Pendiente"}
                </td>
                <td>
                  <button
                    className="control-btn"
                    onClick={() => toggleValidar(r.id)}
                  >
                    {r.validado ? "Quitar" : "Validar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ControlDiario;
