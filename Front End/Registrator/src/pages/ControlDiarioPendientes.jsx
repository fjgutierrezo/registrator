// src/pages/ControlDiarioPendientes.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../styles/ControlDiario.css";
import { getPendientes, validarJornada } from "../services/capatazService";

// Utils
const fmtFecha = (isoOrDate) => new Date(isoOrDate).toLocaleDateString();
const fmtHora  = (isoOrNull) => (isoOrNull ? new Date(isoOrNull).toLocaleTimeString() : "—");
const toLocalDTInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  // datetime-local => "YYYY-MM-DDTHH:MM"
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const localInputToISO = (val) => (val ? new Date(val).toISOString() : null);

function ControlDiarioPendientes() {
  const [dias, setDias] = useState([]); // [{fecha, trabajadores: [...] }]
  const [openDates, setOpenDates] = useState({}); // fecha -> bool
  const [modal, setModal] = useState(null); // { jornada, show: true }

  useEffect(() => {
    getPendientes().then(setDias).catch((e) => console.error(e));
  }, []);

  const noData = useMemo(() => (dias?.length || 0) === 0, [dias]);

  const toggleDate = (fecha) => setOpenDates((st) => ({ ...st, [fecha]: !st[fecha] }));

  // Abrir modal Validar (posible edición)
  const onValidarClick = (j) => {
    setModal({
      show: true,
      jornada: j,
      entradaEdit: toLocalDTInput(j.horaEntradaEditada || j.horaEntrada),
      salidaEdit:  toLocalDTInput(j.horaSalidaEditada  || j.horaSalida),
      motivo: "",
      touched: false,
    });
  };

  const closeModal = () => setModal(null);

  // Confirmar validación
  const confirmarValidacion = async () => {
    if (!modal?.jornada) return;

    const origEnt = modal.jornada.horaEntrada;
    const origSal = modal.jornada.horaSalida;
    const entISO  = localInputToISO(modal.entradaEdit);
    const salISO  = localInputToISO(modal.salidaEdit);

    const editaHoras = (entISO && entISO !== origEnt) || (salISO && salISO !== origSal);
    if (editaHoras && (!modal.motivo || !modal.motivo.trim())) {
      alert("Debes indicar el motivo de la modificación de horas.");
      return;
    }

    // TODO: Reemplaza por los datos del capataz autenticado si los tienes
    const payload = {
      aprobadoPorCedula: "CAP-001",
      aprobadoPorNombre: "Capataz",
    };
    if (editaHoras) {
      if (entISO && entISO !== origEnt) payload.horaEntradaEditadaISO = entISO;
      if (salISO && salISO !== origSal) payload.horaSalidaEditadaISO  = salISO;
      payload.motivoEdicion = modal.motivo.trim();
    }

    try {
      await validarJornada(modal.jornada.id, payload);
      // Quitar al trabajador de su día
      setDias((prev) =>
        prev
          .map((d) => ({
            ...d,
            trabajadores: d.trabajadores.filter((t) => t.id !== modal.jornada.id),
          }))
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
          <h2>Control diario — Validar</h2>
          <a className="control-diario-link" href="/control/validados">Trabajadores validados</a>
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
                            <td>{t.nombreCompleto}</td>
                            <td>{fmtHora(t.horaEntrada)}</td>
                            <td>{fmtHora(t.horaSalida)}</td>
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

      {/* Modal Validar/Editar */}
      {modal?.show && (
        <div className="cd-modal-overlay">
          <div className="cd-modal">
            <h3>Validar jornada</h3>

            <div className="cd-modal-row">
              <div className="cd-modal-col">
                <label>Hora original de entrada</label>
                <input type="text" readOnly value={fmtHora(modal.jornada.horaEntrada)} />
              </div>
              <div className="cd-modal-col">
                <label>Hora original de salida</label>
                <input type="text" readOnly value={fmtHora(modal.jornada.horaSalida)} />
              </div>
            </div>

            <div className="cd-modal-row">
              <div className="cd-modal-col">
                <label>Editar hora de entrada</label>
                <input
                  type="datetime-local"
                  value={modal.entradaEdit}
                  onChange={(e) => setModal((m) => ({ ...m, entradaEdit: e.target.value, touched: true }))}
                />
              </div>
              <div className="cd-modal-col">
                <label>Editar hora de salida</label>
                <input
                  type="datetime-local"
                  value={modal.salidaEdit}
                  onChange={(e) => setModal((m) => ({ ...m, salidaEdit: e.target.value, touched: true }))}
                />
              </div>
            </div>

            <div className="cd-modal-row">
              <div className="cd-modal-col">
                <label>Motivo (obligatorio si modifica horas)</label>
                <textarea
                  value={modal.motivo}
                  onChange={(e) => setModal((m) => ({ ...m, motivo: e.target.value }))}
                  placeholder={`Hora original entrada: ${fmtHora(modal.jornada.horaEntrada)} | salida: ${fmtHora(modal.jornada.horaSalida)}`}
                />
              </div>
            </div>

            <div className="cd-modal-actions">
              <button className="cd-btn" onClick={confirmarValidacion}>Validar</button>
              <button className="cd-btn-sec" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ControlDiarioPendientes;
