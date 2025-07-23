import React, { useState } from "react";
import "../styles/RegistroDiario.css";

function RegistroDiario() {
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [centroCosto, setCentroCosto] = useState("");
  const [frente, setFrente] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [error, setError] = useState("");

  // Obtiene la ubicación del dispositivo
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError("Este navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordenadas({
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
        });
        setError("");
      },
      () => {
        setError("No se pudo obtener tu ubicación.");
      }
    );
  };

  // Envía los datos del registro
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coordenadas) {
      setError("Primero valida tu ubicación.");
      return;
    }

    console.log("Registro enviado:", {
      horaEntrada,
      horaSalida,
      centroCosto,
      frente,
      ...coordenadas,
    });

    alert("✅ Jornada registrada correctamente");

    // Limpiar
    setHoraEntrada("");
    setHoraSalida("");
    setCentroCosto("");
    setFrente("");
    setCoordenadas(null);
    setError("");
  };

  return (
    <div className="registro-diario-page">
      <div className="registro-diario-card">
        <h2>Registro Diario</h2>
        <form className="registro-diario-form" onSubmit={handleSubmit}>
          <label>Centro de Costo:</label>
          <input
            type="text"
            value={centroCosto}
            onChange={(e) => setCentroCosto(e.target.value)}
            required
          />

          <label>Frente de Trabajo:</label>
          <input
            type="text"
            value={frente}
            onChange={(e) => setFrente(e.target.value)}
            required
          />

          <label>Hora de Entrada:</label>
          <input
            type="time"
            value={horaEntrada}
            onChange={(e) => setHoraEntrada(e.target.value)}
            required
          />

          <label>Hora de Salida:</label>
          <input
            type="time"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.target.value)}
            required
          />

          <button type="button" onClick={obtenerUbicacion}>
            Validar Ubicación
          </button>

          {coordenadas && (
            <div className="geo-info">
              ✅ Ubicación: ({coordenadas.latitud.toFixed(5)}, {coordenadas.longitud.toFixed(5)})
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit">Registrar Jornada</button>
        </form>
      </div>
    </div>
  );
}

export default RegistroDiario;
