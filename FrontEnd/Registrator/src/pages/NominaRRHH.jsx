// src/pages/NominaRRHH.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../styles/NominaRRHH.css";
import { obtenerNominaResumen, obtenerNominaDetalle, obtenerNominaDetallePrestacional } from "../services/nominaService";

function NominaRRHH() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const [mes, setMes] = useState(`${yyyy}-${mm}`);

  const [empleados, setEmpleados] = useState([]);
  const [detallesAbiertos, setDetallesAbiertos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEmpleado, setModalEmpleado] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);

  const year = useMemo(() => Number(mes.split("-")[0]), [mes]);
  const month = useMemo(() => Number(mes.split("-")[1]), [mes]);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const resumen = await obtenerNominaResumen(year, month);
        const normalizados = (resumen || []).map((r, idx) => ({
          id: idx + 1,
          nombre: r.nombreCompleto ?? "—",
          documento: r.cedula ?? "—",
          diasResumen: Number(r.diasTrabajados ?? 0),
          valorPagar: Number(r.netoAPagar ?? 0),         // 👈 usamos neto
          devengado: Number(r.devengado ?? 0),           // opcional mostrar en tooltip
          deducciones: Number(r.deducciones ?? 0),       // opcional
        }));
        setEmpleados(normalizados);
        setDetallesAbiertos([]);
      } catch (e) {
        console.error("Error cargando resumen de nómina:", e);
        setEmpleados([]);
      } finally {
        setCargando(false);
      }
    };
    if (year && month) cargar();
  }, [year, month]);

  const toggleDetalle = async (id, documento) => {
    const abierto = detallesAbiertos.includes(id);
    if (abierto) {
      setDetallesAbiertos((prev) => prev.filter((d) => d !== id));
      return;
    }
    try {
      const detalle = await obtenerNominaDetalle(documento, year, month);
      setEmpleados((prev) =>
        prev.map((emp) =>
          emp.id === id
            ? { ...emp, diasTrabajados: detalle || [] }
            : emp
        )
      );
      setDetallesAbiertos((prev) => [...prev, id]);
    } catch (e) {
      console.error("Error cargando detalle:", e);
    }
  };

  const abrirModal = async (emp) => {
    try {
      setModalEmpleado(emp);
      setModalDetalle(null);
      setModalOpen(true);
      const det = await obtenerNominaDetallePrestacional(emp.documento, year, month);
      setModalDetalle(det);
    } catch (e) {
      console.error(e);
    }
  };

  const fmtCOP = (n) =>
    Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(Number(n || 0));

  return (
    <div className="nomina-page">
      <div className="nomina-card">
        <h2>Nómina de Empleados</h2>

        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end" }}>
          <label style={{ marginRight: ".5rem" }}>Mes:</label>
          <input type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
        </div>

        <table className="nomina-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Días trabajados</th>
              <th>Valor a pagar</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan="4">Cargando…</td></tr>
            ) : empleados.length === 0 ? (
              <tr><td colSpan="4">No hay registros en el mes seleccionado.</td></tr>
            ) : (
              empleados.map((emp) => (
                <React.Fragment key={emp.id}>
                  <tr>
                    <td
                      className="nomina-nombre"
                      onClick={() => toggleDetalle(emp.id, emp.documento)}
                      title="Ver detalle de jornadas"
                    >
                      {emp.nombre}
                    </td>
                    <td>{emp.documento}</td>
                    <td>{emp.diasResumen ?? 0}</td>
                    <td>
                      <button className="btn-link" onClick={() => abrirModal(emp)} title="Ver desglose prestacional">
                        {fmtCOP(emp.valorPagar)}
                      </button>
                    </td>
                  </tr>

                  {detallesAbiertos.includes(emp.id) && (
                    <tr className="detalle-tr">
                      <td colSpan="4">
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
                            {(emp.diasTrabajados || []).map((d, i) => (
                              <tr key={i}>
                                <td>{d.fecha}</td>
                                <td>{d.centro}</td>
                                <td>{d.entrada ?? "—"}</td>
                                <td>{d.salida ?? "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PRESTACIONAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalle Prestacional — {modalEmpleado?.nombre}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✖</button>
            </div>

            {!modalDetalle ? (
              <div>Cargando detalle…</div>
            ) : (
              <div className="modal-body">
                <div className="grid-2">
                  <div>
                    <h4>Devengados</h4>
                    <ul>
                      <li>Salario proporcional: <strong>{fmtCOP(modalDetalle.salarioProporcional)}</strong></li>
                      <li>Aux. transporte: <strong>{fmtCOP(modalDetalle.auxTransporteProporcional)}</strong></li>
                      <li>Extras diurnas: <strong>{fmtCOP(modalDetalle.extrasDiurnas)}</strong></li>
                      <li>Extras nocturnas: <strong>{fmtCOP(modalDetalle.extrasNocturnas)}</strong></li>
                      <li>Extras dom./fest. diurnas: <strong>{fmtCOP(modalDetalle.extrasDomDiurnas)}</strong></li>
                      <li>Extras dom./fest. noct.: <strong>{fmtCOP(modalDetalle.extrasDomNocturnas)}</strong></li>
                      <li>Recargo nocturno: <strong>{fmtCOP(modalDetalle.recargosNocturnos)}</strong></li>
                      <li>Recargo dom./fest.: <strong>{fmtCOP(modalDetalle.recargosDomFest)}</strong></li>
                      <li>Total devengado: <strong>{fmtCOP(modalDetalle.devengado)}</strong></li>
                    </ul>
                  </div>
                  <div>
                    <h4>Deducciones (Trabajador)</h4>
                    <ul>
                      <li>Salud (4%): <strong>{fmtCOP(modalDetalle.saludTrab)}</strong></li>
                      <li>Pensión (4%): <strong>{fmtCOP(modalDetalle.pensionTrab)}</strong></li>
                      <li>Total deducciones: <strong>{fmtCOP(modalDetalle.deducciones)}</strong></li>
                    </ul>

                    <h4 style={{ marginTop: '1rem' }}>Aportes Empleador (Info)</h4>
                    <ul>
                      <li>Salud: <strong>{fmtCOP(modalDetalle.saludEmp)}</strong></li>
                      <li>Pensión: <strong>{fmtCOP(modalDetalle.pensionEmp)}</strong></li>
                      <li>Caja: <strong>{fmtCOP(modalDetalle.caja)}</strong></li>
                      <li>SENA: <strong>{fmtCOP(modalDetalle.sena)}</strong></li>
                      <li>ICBF: <strong>{fmtCOP(modalDetalle.icbf)}</strong></li>
                      <li>ARL: <strong>{fmtCOP(modalDetalle.arl)}</strong></li>
                    </ul>

                    <h4 style={{ marginTop: '1rem' }}>Prestaciones (Prorrateadas)</h4>
                    <ul>
                      <li>Cesantías mes: <strong>{fmtCOP(modalDetalle.cesantiasMes)}</strong></li>
                      <li>Intereses cesantías mes: <strong>{fmtCOP(modalDetalle.interesesCesantiasMes)}</strong></li>
                      <li>Prima mes: <strong>{fmtCOP(modalDetalle.primaMes)}</strong></li>
                      <li>Vacaciones mes: <strong>{fmtCOP(modalDetalle.vacacionesMes)}</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="modal-footer">
                  <div><strong>Neto a pagar: {fmtCOP(modalDetalle.neto)}</strong></div>
                  <button className="btn" onClick={() => setModalOpen(false)}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NominaRRHH;
