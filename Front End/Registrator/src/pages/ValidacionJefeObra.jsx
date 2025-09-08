// src/pages/ValidacionJefeObra.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ControlDiario.css";
import { getPendientesJefe, aprobarPaquete } from "../services/jefeObraService";

// Utils
const fmtFecha = (isoOrDate) => new Date(isoOrDate).toLocaleDateString();
const fmtHora  = (iso) => (iso ? new Date(iso).toLocaleTimeString() : "—");

function ValidacionJefeObra() {
  const [dias, setDias] = useState([]);
  const [openDays, setOpenDays] = useState({});
  const [openFronts, setOpenFronts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPendientesJefe()
      .then((data) => setDias(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const noData = useMemo(() => (dias?.length || 0) === 0, [dias]);

  const toggleDay = (fecha) => setOpenDays((s) => ({ ...s, [fecha]: !s[fecha] }));
  const toggleFront = (fecha, frenteId) => {
    const key = `${fecha}-${frenteId}`;
    setOpenFronts((s) => ({ ...s, [key]: !s[key] }));
  };

  const onAprobarPaquete = async (fecha, frente) => {
    if (!confirm(`¿Aprobar TODAS las jornadas del frente "${frente.nombreFrente}" el ${fmtFecha(fecha)}?`)) return;
    try {
      // TODO: reemplazar con datos del usuario autenticado
      const payload = { jefeCedula: "JEFE-001", jefeNombreCompleto: "Jefe de Obra" };
      await aprobarPaquete(fecha, frente.frenteId, payload);

      setDias((prev) =>
        prev
          .map((d) => {
            if (d.fecha !== fecha) return d;
            const frentesRest = d.frentes.filter((f) => f.frenteId !== frente.frenteId);
            return { ...d, frentes: frentesRest };
          })
          .filter((d) => d.frentes.length > 0)
      );
    } catch (e) {
      const msg = e?.response?.data || e.message;
      alert("No se pudo aprobar el paquete: " + msg);
    }
  };

  return (
    <div className="control-diario-container">
      <div className="control-diario-card">
        <div className="control-diario-header">
          <h2>Validación Jefe de Obra</h2>
          <div className="flex gap-2">
            <Link className="control-diario-link" to="/control-diario-pendiente">Capataz: Pendientes</Link>
            <Link className="control-diario-link" to="/control-diario-validado">Capataz: Validados</Link>
          </div>
        </div>

        {loading ? (
          <div className="control-diario-empty">Cargando…</div>
        ) : noData ? (
          <div className="control-diario-empty">No hay paquetes pendientes por aprobar.</div>
        ) : (
          <div className="cd-list-dias">
            {dias.map((dia) => (
              <div key={dia.fecha} className="cd-dia-card">
                {/* Nivel Día */}
                <div className="cd-dia-header" onClick={() => toggleDay(dia.fecha)}>
                  <div className="cd-dia-fecha">{fmtFecha(dia.fecha)}</div>
                  <div className="cd-dia-contador">{dia.frentes.length} frente(s)</div>
                </div>

                {openDays[dia.fecha] && (
                  <div className="cd-dia-body">
                    {dia.frentes.map((frente) => {
                      const fKey = `${dia.fecha}-${frente.frenteId}`;
                      return (
                        <div key={frente.frenteId} style={{ marginBottom: "1rem" }}>
                          {/* Nivel Frente */}
                          <div className="cd-dia-header" onClick={() => toggleFront(dia.fecha, frente.frenteId)}>
                            <div className="cd-dia-fecha">
                              Frente: <strong>{frente.nombreFrente}</strong>
                            </div>
                            <div className="cd-dia-contador">Centro de costo: {frente.centroCosto || "N/D"}</div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: ".5rem" }}>
                            <button className="cd-btn" onClick={() => onAprobarPaquete(dia.fecha, frente)}>
                              Aprobar paquete completo
                            </button>
                          </div>

                          {openFronts[fKey] && (
                            <div className="cd-dia-body">
                              <table className="cd-tabla">
                                <thead>
                                  <tr>
                                    <th>Trabajador</th>
                                    <th>Rol</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {frente.trabajadores?.map((t) => (
                                    <tr key={t.jornadaId}>
                                      <td>{t.nombreCompleto}</td>
                                      <td>{t.rol || "Trabajador"}</td>
                                      <td>{fmtHora(t.horaEntrada)}</td>
                                      <td>{fmtHora(t.horaSalida)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ValidacionJefeObra;
