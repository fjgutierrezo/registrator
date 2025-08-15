// src/pages/RegistroDiario.jsx
import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import "../styles/RegistroDiario.css";
import { AuthContext } from "../utils/AuthContext";
import { listarFrentesPorCedula } from "../services/trabajadorFrenteService";
import { crearEntrada, registrarSalida, getActivaPorCedula } from "../services/jornadaService";

// Utilidad local: distancia Haversine en metros
const distM = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // m
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function RegistroDiario() {
  const { usuario } = useContext(AuthContext); // Debe contener al menos { cedula, primerNombre... }
  const cedula = usuario?.cedula;

  // Reloj en cabecera (hora del sistema del dispositivo)
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const isoNow = useMemo(() => new Date().toISOString(), [now]); // para enviar como horaCliente

  // Frentes del trabajador
  const [frentes, setFrentes] = useState([]); // elementos con .frenteTrabajo { id, nombre, centroCosto, latitudCentro, longitudCentro, radioMetros }
  const [frenteSelId, setFrenteSelId] = useState(""); // se fijará automáticamente si hay jornada activa
  const frenteSel = useMemo(
    () => frentes.find((f) => String(f?.frenteTrabajo?.id) === String(frenteSelId)) || null,
    [frentes, frenteSelId]
  );

  // Geolocalización
  const [pos, setPos] = useState(null); // { lat, lng, accuracy }
  const [geoError, setGeoError] = useState("");
  const watchIdRef = useRef(null);

  // Jornada actual/diaria
  const [jornadaId, setJornadaId] = useState(null);
  const [horaEntradaCliente, setHoraEntradaCliente] = useState(null); // para UI (reanudación)
  const [jornadaHoy, setJornadaHoy] = useState(null); // { estado, aprobacionEstado, ... } (cuando detectamos que ya existe o se cierra)

  // Observaciones y adjuntos
  const [obsEntrada, setObsEntrada] = useState("");
  const [filesEntrada, setFilesEntrada] = useState([]);
  const [obsSalida, setObsSalida] = useState("");
  const [filesSalida, setFilesSalida] = useState([]);

  // ¿Está dentro de la zona del frente?
  const dentroDeZona = useMemo(() => {
    if (!pos || !frenteSel?.frenteTrabajo) return false;
    const ft = frenteSel.frenteTrabajo;
    const d = distM(pos.lat, pos.lng, ft.latitudCentro, ft.longitudCentro);
    return d <= ft.radioMetros;
  }, [pos, frenteSel]);

  // 1) Cargar frentes por cédula al montar
  useEffect(() => {
    if (!cedula) return;
    listarFrentesPorCedula(cedula)
      .then(setFrentes)
      .catch((e) => console.error("Error listando frentes por cédula:", e));
  }, [cedula]);

  // 2) Al montar: consultar si hay jornada activa POR CÉDULA para fijar frente y mostrar salida
  useEffect(() => {
    if (!cedula) return;
    getActivaPorCedula(cedula)
      .then((res) => {
        if (res && res.jornadaId) {
          setJornadaId(res.jornadaId);
          setHoraEntradaCliente(res.horaEntradaCliente || res.horaEntradaServidor);
          if (res.frenteTrabajoId) setFrenteSelId(String(res.frenteTrabajoId)); // fija el frente del ingreso
          setJornadaHoy(null);
        } else {
          setJornadaId(null);
          setHoraEntradaCliente(null);
        }
      })
      .catch(() => {
        setJornadaId(null);
        setHoraEntradaCliente(null);
      });
  }, [cedula]);

  // 3) Geolocalización activa solo cuando tenemos un frente seleccionado (sea por usuario o fijado por jornada activa)
  useEffect(() => {
    if (!frenteSelId) return;

    if ("geolocation" in navigator) {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (p) => {
          setPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy });
          setGeoError("");
        },
        (err) => setGeoError(err?.message || "No se pudo obtener ubicación."),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGeoError("Este navegador no soporta geolocalización.");
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [frenteSelId]);

  // Derivado: si ya registró jornada hoy (cerrada o en aprobación), bloqueamos entrada
  const jornadaCerradaHoy = useMemo(() => {
    if (!jornadaHoy) return false;
    return (
      jornadaHoy.estado === "CERRADA" ||
      jornadaHoy.aprobacionEstado === "APROBADO" ||
      jornadaHoy.aprobacionEstado === "EN_APROBACION"
    );
  }, [jornadaHoy]);

  // Reglas de habilitación de botones
  const puedeRegistrarEntrada =
    !!cedula && !!frenteSelId && !!pos && dentroDeZona && !jornadaId && !jornadaCerradaHoy;
  const puedeRegistrarSalida = !!jornadaId && !!pos && dentroDeZona;

  // Handlers
  const handleRegistrarEntrada = async () => {
    if (!cedula || !frenteSelId || !pos) return;
    try {
      const res = await crearEntrada({
        cedula,
        frenteTrabajoId: Number(frenteSelId),
        lat: pos.lat,
        lng: pos.lng,
        accuracy: pos.accuracy ?? null,
        horaClienteISO: isoNow,
        observacion: obsEntrada,
        files: filesEntrada,
      });
      setJornadaId(res.jornadaId);
      setHoraEntradaCliente(res.horaEntradaCliente || res.horaEntradaServidor);
      setObsEntrada("");
      setFilesEntrada([]);
      setJornadaHoy(null); // recién creada
      alert("Ingreso registrado correctamente.");
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data || e.message || "";
      if (String(msg).toLowerCase().includes("ya existe una jornada registrada hoy")) {
        setJornadaHoy({ estado: "CERRADA", aprobacionEstado: "EN_APROBACION" });
      }
      alert("No se pudo registrar entrada: " + msg);
    }
  };

  const handleRegistrarSalida = async () => {
    if (!jornadaId || !pos) return;

    // Advertir si < 8 horas (hora cliente mostrada en UI)
    if (horaEntradaCliente) {
      const ms = new Date().getTime() - new Date(horaEntradaCliente).getTime();
      const horas = ms / 1000 / 3600;
      if (horas < 8) {
        const ok = confirm(
          `Solo han transcurrido ${horas.toFixed(2)}h (< 8h). ¿Seguro que deseas registrar la salida?`
        );
        if (!ok) return;
      }
    }

    try {
      await registrarSalida(jornadaId, {
        lat: pos.lat,
        lng: pos.lng,
        accuracy: pos.accuracy ?? null,
        horaClienteISO: isoNow,
        observacion: obsSalida,
        files: filesSalida,
      });
      alert("Salida registrada correctamente.");
      // Al cerrar la jornada, bloqueamos hasta el día siguiente
      setObsSalida("");
      setFilesSalida([]);
      setJornadaId(null);
      setHoraEntradaCliente(null);
      setJornadaHoy({ estado: "CERRADA", aprobacionEstado: "EN_APROBACION" });
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data || e.message || "";
      alert("No se pudo registrar salida: " + msg);
    }
  };

  return (
    <div className="registro-diario">
      {/* Header superior */}
      <div className="rd-header">
        <div className="rd-usuario">
          <div className="rd-saludo">Hola, {usuario?.primerNombre || usuario?.nombre || "Trabajador"}</div>
          <div className="rd-cedula">Cédula: {cedula || "-"}</div>
        </div>
        <div className="rd-fecha-hora">
          <div>{now.toLocaleDateString()}</div>
          <div className="rd-hora">{now.toLocaleTimeString()}</div>
        </div>
      </div>

      <section className="rd-contenido">
        {/* Selección de frente */}
        <div className="rd-card">
          <h3>Selecciona tu frente de trabajo</h3>
          <div className="rd-campo">
            <label>Frente</label>
            <select
              value={frenteSelId}
              onChange={(e) => setFrenteSelId(e.target.value)}
              disabled={!!jornadaId} // bloqueado si hay jornada activa (se fijó con la del ingreso)
            >
              <option value="">-- Selecciona un frente --</option>
              {frentes.map((tf) => (
                <option key={tf.id || tf.frenteTrabajo?.id} value={tf.frenteTrabajo?.id}>
                  {tf.frenteTrabajo?.nombre} — {tf.frenteTrabajo?.centroCosto}
                </option>
              ))}
            </select>
          </div>

          {/* Estado geolocalización del frente seleccionado */}
          {frenteSel && (
            <div className={`rd-geoestado ${dentroDeZona ? "ok" : "bad"}`}>
              {pos ? (
                <>
                  <div>
                    <strong>Ubicación:</strong>{" "}
                    {pos.lat.toFixed(5)}, {pos.lng.toFixed(5)} (±{Math.round(pos.accuracy || 0)}m)
                  </div>
                  <div>
                    <strong>Zona:</strong> {dentroDeZona ? "Dentro del radio" : "Fuera de la zona"}
                  </div>
                </>
              ) : (
                <div>Obteniendo ubicación…</div>
              )}
              {geoError && <div className="rd-error">{geoError}</div>}
            </div>
          )}
        </div>

        {/* Banner bloqueo por jornada diaria existente */}
        {jornadaCerradaHoy && (
          <div className="rd-card" style={{ borderColor: "var(--color-primary)" }}>
            <h3>Jornada del día registrada</h3>
            <p>
              El dia de hoy ya se registro tu jornada laboral <br />
              {jornadaHoy?.aprobacionEstado && (
                <>
                  {" "}
                  Estado del registro: <strong>{jornadaHoy.aprobacionEstado}</strong>.
                </>
              )}
            </p>
          </div>
        )}

        {/* BLOQUE ENTRADA */}
        {!jornadaId && (
          <div className="rd-card">
            <h3>Registrar ingreso</h3>
            <div className="rd-campo">
              <label>Hora de entrada</label>
              <input type="text" readOnly value={new Date(isoNow).toLocaleTimeString()} />
            </div>

            <div className="rd-campo">
              <label>Observación (opcional)</label>
              <textarea
                value={obsEntrada}
                onChange={(e) => setObsEntrada(e.target.value)}
                placeholder="Comentario…"
              />
            </div>

            <div className="rd-campo">
              <label>Adjuntos (imagen/PDF)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={(e) => setFilesEntrada(Array.from(e.target.files || []))}
              />
            </div>

            <button disabled={!puedeRegistrarEntrada} onClick={handleRegistrarEntrada}>
              Registrar ingreso
            </button>
          </div>
        )}

        {/* BLOQUE SALIDA */}
        {jornadaId && (
          <div className="rd-card">
            <h3>Registrar salida</h3>

            {/* Hora de entrada (solo lectura) */}
            <div className="rd-campo">
              <label>Hora de entrada</label>
              <input
                type="text"
                readOnly
                value={
                  horaEntradaCliente
                    ? new Date(horaEntradaCliente).toLocaleTimeString()
                    : "—"
                }
              />
            </div>

            {/* Hora de salida (momento actual) */}
            <div className="rd-campo">
              <label>Hora de salida</label>
              <input type="text" readOnly value={new Date(isoNow).toLocaleTimeString()} />
            </div>

            <div className="rd-campo">
              <label>Observación (opcional)</label>
              <textarea
                value={obsSalida}
                onChange={(e) => setObsSalida(e.target.value)}
                placeholder="Comentario…"
              />
            </div>

            <div className="rd-campo">
              <label>Adjuntos (imagen/PDF)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={(e) => setFilesSalida(Array.from(e.target.files || []))}
              />
            </div>

            <button disabled={!puedeRegistrarSalida} onClick={handleRegistrarSalida}>
              Registrar salida
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default RegistroDiario;
