// src/pages/ControlDiarioPendientes.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ControlDiario.css";
import { getPendientes, validarJornada } from "../services/capatazService";

// ---- Utils de tiempo (SOLO HORA) ----
const fmtFecha = (d) => new Date(d).toLocaleDateString();
const fmtHora = (iso) => (iso ? new Date(iso).toLocaleTimeString() : "—");

// De un ISO -> "HH:MM" local (para <input type="time">)
const isoToTimeHM = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Combina la FECHA del ISO original con una nueva hora "HH:MM" (devuelve ISO)
const combineISOWithTimeHM = (originalISO, hhmm) => {
  if (!originalISO || !hhmm) return null;
  const [hh, mm] = hhmm.split(":").map((x) => parseInt(x, 10));
  const d = new Date(originalISO); // fecha original
  // Creamos un Date local con misma fecha y nueva hora
  const newD = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm, 0, 0);
  return newD.toISOString(); // el backend usa OffsetDateTime.parse() -> UTC OK
};

function ControlDiarioPendientes() {
  const [dias, setDias] = useState([]);
  const [openDates, setOpenDates] = useState({});
  // { [jornadaId]: { entradaHM, salidaHM, origEntradaHM, origSalidaHM, origEntradaISO, origSalidaISO } }
  const [editMap, setEditMap] = useState({});
  // Modal solo si detectamos cambios
  const [modal, setModal] = useState(null); // { show, jornada, entradaISO, salidaISO, motivo, origEntradaISO, origSalidaISO }

  useEffect(() => {
    getPendientes()
      .then((data) => {
        setDias(data || []);
        const init = {};
        (data || []).forEach((dia) => {
          dia.trabajadores.forEach((t) => {
            const entISO = t.horaEntradaEditada || t.horaEntrada;
            const salISO = t.horaSalidaEditada || t.horaSalida;
            init[t.id] = {
              entradaHM: isoToTimeHM(entISO),
              salidaHM: isoToTimeHM(salISO),
              origEntradaHM: isoToTimeHM(t.horaEntrada),
              origSalidaHM: isoToTimeHM(t.horaSalida),
              origEntradaISO: t.horaEntrada,
              origSalidaISO: t.horaSalida,
            };
          });
        });
        setEditMap(init);
      })
      .catch(console.error);
  }, []);

  const noData = useMemo(() => (dias?.length || 0) === 0, [dias]);
  const toggleDate = (fecha) => setOpenDates((s) => ({ ...s, [fecha]: !s[fecha] }));

  const onChangeEntrada = (jid, val) =>
    setEditMap((m) => ({ ...m, [jid]: { ...(m[jid] || {}), entradaHM: val } }));
  const onChangeSalida = (jid, val) =>
    setEditMap((m) => ({ ...m, [jid]: { ...(m[jid] || {}), salidaHM: val } }));

  const onValidarClick = async (j) => {
    const ed = editMap[j.id] || {};
    // Detectamos cambios SOLO por “HH:MM”
    const cambioEntrada = !!ed.entradaHM && ed.entradaHM !== ed.origEntradaHM;
    const cambioSalida = !!ed.salidaHM && ed.salidaHM !== ed.origSalidaHM;
    const huboCambios = cambioEntrada || cambioSalida;

    if (!huboCambios) {
      // Validar directo sin modal
      try {
        await validarJornada(j.id, {
          aprobadoPorCedula: "CAP-001",
          aprobadoPorNombre: "Capataz",
        });
        setDias((prev) =>
          prev
            .map((d) => ({ ...d, trabajadores: d.trabajadores.filter((t) => t.id !== j.id) }))
            .filter((d) => d.trabajadores.length > 0)
        );
      } catch (e) {
        const msg = e?.response?.data || e.message;
        alert("No se pudo validar: " + msg);
      }
      return;
    }

    // Si hubo cambios → armamos nuevos ISO conservando fecha original
    const entradaISO = cambioEntrada
      ? combineISOWithTimeHM(ed.origEntradaISO, ed.entradaHM)
      : null;
    const salidaISO = cambioSalida ? combineISOWithTimeHM(ed.origSalidaISO, ed.salidaHM) : null;

    setModal({
      show: true,
      jornada: j,
      entradaISO,
      salidaISO,
      motivo: "",
      origEntradaISO: ed.origEntradaISO,
      origSalidaISO: ed.origSalidaISO,
    });
  };

  const closeModal = () => setModal(null);

  const confirmarModal = async () => {
    if (!modal?.jornada) return;
    if (!modal.motivo || !modal.motivo.trim()) {
      alert("Debes indicar el motivo de la modificación de horas.");
      return;
    }
    const payload = {
      aprobadoPorCedula: "CAP-001",
      aprobadoPorNombre: "Capataz",
      motivoEdicion: modal.motivo.trim(),
    };
    if (modal.entradaISO) payload.horaEntradaEditadaISO = modal.entradaISO;
    if (modal.salidaISO) payload.horaSalidaEditadaISO = modal.salidaISO;

    try {
      await validarJornada(modal.jornada.id, payload);
      setDias((prev) =>
        prev
          .map((d) => ({ ...d, trabajadores: d.trabajadores.filter((t) => t.id !== modal.jornada.id) }))
          .filter((d) => d.trabajadores.length > 0)
      );
      closeModal();
    } catch (e) {
      const msg = e?.response?.data || e.message;
      alert("No se pudo validar: " + msg);
    }
  };

  return (
    <div className="control-diario-container">
      <div className="control-diario-card">
        <div className="control-diario-header">
          <h2>Control Diario De Obra</h2>
          <Link className="control-diario-link" to="/control-diario-validado">
            Trabajadores validados
          </Link>
        </div>

        {noData ? (
          <div className="control-diario-empty">No tiene registros pendientes por validar.</div>
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
                            {/* Nombre: fallback a cédula si API no lo trae */}
                            <td>{t.nombreCompleto || t.cedula}</td>

                            {/* Edición SOLO hora */}
                            <td>
                              <input
                                type="time"
                                value={editMap[t.id]?.entradaHM || ""}
                                onChange={(e) => onChangeEntrada(t.id, e.target.value)}
                              />
                              <div className="cd-hora-original">
                                Original: {fmtHora(editMap[t.id]?.origEntradaISO)}
                              </div>
                            </td>
                            <td>
                              <input
                                type="time"
                                value={editMap[t.id]?.salidaHM || ""}
                                onChange={(e) => onChangeSalida(t.id, e.target.value)}
                              />
                              <div className="cd-hora-original">
                                Original: {fmtHora(editMap[t.id]?.origSalidaISO)}
                              </div>
                            </td>

                            <td>{t.frenteNombre}</td>
                            <td>{t.aprobacionEstado}</td>
                            <td>
                              <button className="cd-btn" onClick={() => onValidarClick(t)}>
                                Validar
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

      {/* Modal SOLO si hubo cambios: evidencia + motivo */}
      {modal?.show && (
        <div className="cd-modal-overlay">
          <div className="cd-modal">
            <h3>Confirmar validación con cambios</h3>

            <div className="cd-modal-row">
              <div className="cd-modal-col">
                <label>Hora original de entrada</label>
                <input type="text" readOnly value={fmtHora(modal.origEntradaISO)} />
              </div>
              <div className="cd-modal-col">
                <label>Hora original de salida</label>
                <input type="text" readOnly value={fmtHora(modal.origSalidaISO)} />
              </div>
            </div>

            <div className="cd-modal-row">
              <div className="cd-modal-col">
                <label>Motivo de la modificación</label>
                <textarea
                  value={modal.motivo}
                  onChange={(e) => setModal((m) => ({ ...m, motivo: e.target.value }))}
                  placeholder={`Explica el motivo (Entrada original: ${fmtHora(
                    modal.origEntradaISO
                  )} | Salida original: ${fmtHora(modal.origSalidaISO)})`}
                />
              </div>
            </div>

            <div className="cd-modal-actions">
              <button className="cd-btn" onClick={confirmarModal}>
                Validar
              </button>
              <button className="cd-btn-sec" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ControlDiarioPendientes;
