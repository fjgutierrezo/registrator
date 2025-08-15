// src/pages/ControlDiarioValidados.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../styles/ControlDiario.css";
import { getValidadas, quitarValidacion } from "../services/capatazService";

const fmtFecha = (isoOrDate) => new Date(isoOrDate).toLocaleDateString();
const fmtHora  = (isoOrNull) => (isoOrNull ? new Date(isoOrNull).toLocaleTimeString() : "—");

function ControlDiarioValidados() {
  const [dias, setDias] = useState([]);
  const [openDates, setOpenDates] = useState({});

  useEffect(() => {
    getValidadas().then(setDias).catch((e) => console.error(e));
  }, []);

  const noData = useMemo(() => (dias?.length || 0) === 0, [dias]);
  const toggleDate = (fecha) => setOpenDates((st) => ({ ...st, [fecha]: !st[fecha] }));

  const onQuitar = async (j) => {
    if (!confirm(`¿Quitar validación de ${j.nombreCompleto}?`)) return;
    try {
      await quitarValidacion(j.id);
      setDias((prev) =>
        prev
          .map((d) => ({
            ...d,
            trabajadores: d.trabajadores.filter((t) => t.id !== j.id),
          }))
          .filter((d) => d.trabajadores.length > 0)
      );
    } catch (e) {
      const msg = e?.response?.data || e.message;
      alert("No se pudo quitar validación: " + msg);
    }
  };

  return (
    <div className="control-diario-container">
      <div className="control-diario-card">
        <div className="control-diario-header">
          <h2>Control diario — Validados (mes en curso)</h2>
          <a className="control-diario-link" href="/control/pendientes">Validar</a>
        </div>

        {noData ? (
          <div className="control-diario-empty">No hay jornadas validadas en el mes en curso.</div>
        ) : (
          <div className="cd-list-dias">
            {dias.map((dia) => (
              <div key={dia.fecha} className="cd-dia-card">
                <div className="cd-dia-header" onClick={() => toggleDate(dia.fecha)}>
                  <div className="cd-dia-fecha">{fmtFecha(dia.fecha)}</div>
                  <div className="cd-dia-contador">{dia.trabajadores.length} trabajador(es)</div>
                </div>

                {openDates[dia.fecha] && (
                  <div className="cd-dia-body">
                    <table className="cd-tabla">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Entrada</th>
                          <th>Salida</th>
                          <th>Frente</th>
                          <th>Estado</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dia.trabajadores.map((t) => (
                          <tr key={t.id}>
                            <td>{t.nombreCompleto}</td>
                            <td>{fmtHora(t.horaEntradaEditada || t.horaEntrada)}</td>
                            <td>{fmtHora(t.horaSalidaEditada  || t.horaSalida)}</td>
                            <td>{t.frenteNombre}</td>
                            <td>{t.aprobacionEstado}</td>
                            <td>
                              <button className="cd-btn" onClick={() => onQuitar(t)}>
                                Quitar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default ControlDiarioValidados;
