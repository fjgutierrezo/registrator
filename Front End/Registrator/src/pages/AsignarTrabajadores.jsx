import React, { useState, useEffect } from "react";
import "../styles/AsignarTrabajadores.css";

function AsignarTrabajadores() {
  const [frentes, setFrentes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [frenteSeleccionado, setFrenteSeleccionado] = useState(null);
  const [busquedaFrente, setBusquedaFrente] = useState("");
  const [busquedaTrabajador, setBusquedaTrabajador] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Simulación de carga inicial (luego conectamos a backend)
  useEffect(() => {
    setFrentes([
      { id: 1, nombre: "Frente A" },
      { id: 2, nombre: "Frente B" },
      { id: 3, nombre: "Frente C" }
    ]);
    setTrabajadores([
      { id: 101, nombre: "Juan Pérez", frentesAsignados: ["Frente B"] },
      { id: 102, nombre: "María López", frentesAsignados: [] },
      { id: 103, nombre: "Carlos Gómez", frentesAsignados: ["Frente A", "Frente C"] }
    ]);
  }, []);

  const seleccionarTrabajador = (trabajador) => {
    if (!seleccionados.find(t => t.id === trabajador.id)) {
      setSeleccionados([...seleccionados, trabajador]);

      if (trabajador.frentesAsignados.length > 0) {
        setMensaje(`⚠ El trabajador ${trabajador.nombre} ya está asignado a: ${trabajador.frentesAsignados.join(", ")}`);
      } else {
        setMensaje("");
      }
    }
  };

  const quitarSeleccionado = (id) => {
    setSeleccionados(seleccionados.filter(t => t.id !== id));
  };

  const asignarTrabajadores = () => {
    if (!frenteSeleccionado) {
      setMensaje("⚠ Debes seleccionar un frente primero.");
      return;
    }
    if (seleccionados.length === 0) {
      setMensaje("⚠ No has seleccionado trabajadores.");
      return;
    }
    // Aquí iría la llamada al backend
    console.log("Asignando", seleccionados, "al frente", frenteSeleccionado);
    setMensaje("✅ Trabajadores asignados correctamente.");
    setSeleccionados([]);
  };

  return (
    <div className="asignar-container">
      <div className="asignar-card">
        <h2>Asignar Trabajadores a Frente</h2>

        {/* Selector de frente */}
        <div className="buscadores-dobles">
          <input
            type="text"
            placeholder="Buscar frente..."
            value={busquedaFrente}
            onChange={(e) => setBusquedaFrente(e.target.value)}
          />
        </div>
        <table className="tabla-trabajadores">
          <thead>
            <tr>
              <th>Frente</th>
            </tr>
          </thead>
          <tbody>
            {frentes
              .filter(f => f.nombre.toLowerCase().includes(busquedaFrente.toLowerCase()))
              .map(f => (
                <tr
                  key={f.id}
                  onClick={() => setFrenteSeleccionado(f)}
                  style={{ backgroundColor: frenteSeleccionado?.id === f.id ? "var(--color-primary)" : "" }}
                >
                  <td>{f.nombre}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Buscador de trabajadores */}
        <div className="buscadores-dobles">
          <input
            type="text"
            placeholder="Buscar trabajador..."
            value={busquedaTrabajador}
            onChange={(e) => setBusquedaTrabajador(e.target.value)}
          />
        </div>
        <table className="tabla-trabajadores">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Frentes Asignados</th>
            </tr>
          </thead>
          <tbody>
            {trabajadores
              .filter(t => t.nombre.toLowerCase().includes(busquedaTrabajador.toLowerCase()))
              .map(t => (
                <tr key={t.id} onClick={() => seleccionarTrabajador(t)}>
                  <td>{t.nombre}</td>
                  <td>{t.frentesAsignados.join(", ") || "Ninguno"}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Lista de seleccionados */}
        <ul className="lista-seleccionados">
          {seleccionados.map(t => (
            <li key={t.id}>
              {t.nombre}
              <button onClick={() => quitarSeleccionado(t.id)}>❌</button>
            </li>
          ))}
        </ul>

        {/* Mensaje */}
        {mensaje && <p className="asignar-mensaje">{mensaje}</p>}

        {/* Botón asignar */}
        <button onClick={asignarTrabajadores}>Asignar</button>
      </div>
    </div>
  );
}

export default AsignarTrabajadores;
