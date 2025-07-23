import React, { useState } from "react";
import "../styles/NominaRRHH.css";

function NominaRRHH() {
  const [empleados, setEmpleados] = useState([
    {
      id: 1,
      nombre: "Pedro Pérez",
      documento: "12345678",
      diasTrabajados: [
        {
          fecha: "2025-07-01",
          centro: "CC-01",
          entrada: "07:00",
          salida: "17:00",
        },
        {
          fecha: "2025-07-02",
          centro: "CC-01",
          entrada: "07:00",
          salida: "17:00",
        },
      ],
    },
    {
      id: 2,
      nombre: "Laura Gómez",
      documento: "87654321",
      diasTrabajados: [
        {
          fecha: "2025-07-01",
          centro: "CC-02",
          entrada: "07:15",
          salida: "16:45",
        },
      ],
    },
  ]);

  const [detallesAbiertos, setDetallesAbiertos] = useState([]);

  const toggleDetalle = (id) => {
    setDetallesAbiertos((prev) =>
      prev.includes(id)
        ? prev.filter((d) => d !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="nomina-page">
      <div className="nomina-card">
        <h2>Nómina de Empleados</h2>
        <table className="nomina-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Días trabajados</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <React.Fragment key={emp.id}>
                <tr>
                  <td
                    className="nomina-nombre"
                    onClick={() => toggleDetalle(emp.id)}
                  >
                    {emp.nombre}
                  </td>
                  <td>{emp.documento}</td>
                  <td>{emp.diasTrabajados.length}</td>
                </tr>

                {detallesAbiertos.includes(emp.id) && (
                  <tr className="detalle-tr">
                    <td colSpan="3">
                      <strong>Detalle de jornadas:</strong>
                      <table className="detalle-nomina">
  <thead>
    <tr>
      <th>Fecha</th>
      <th>Centro de Costo</th>
      <th>Hora Entrada</th>
      <th>Hora Salida</th>
    </tr>
  </thead>
  <tbody>
    {emp.diasTrabajados.map((d, i) => (
      <tr key={i}>
        <td>{d.fecha}</td>
        <td>{d.centro}</td>
        <td>{d.entrada}</td>
        <td>{d.salida}</td>
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

export default NominaRRHH;
