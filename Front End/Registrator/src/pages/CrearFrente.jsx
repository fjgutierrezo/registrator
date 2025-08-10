import React, { useState, useContext, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle } from "@react-google-maps/api";
import "../styles/CrearFrente.css";
import { AuthContext } from "../utils/AuthContext";
import { crearFrenteTrabajo, obtenerFrentesTrabajo } from "../services/frenteService";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerBogota = { lat: 4.60971, lng: -74.08175 };

// Normaliza texto: trim, lowercase y quitar diacríticos
const normalize = (s = "") =>
  s.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function CrearFrente() {
  const { usuario } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [centroCosto, setCentroCosto] = useState("");
  const [radio, setRadio] = useState(50);
  const [posicion, setPosicion] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Frentes y búsqueda
  const [frentes, setFrentes] = useState([]);
  const [busquedaFrente, setBusquedaFrente] = useState("");
  const [frentesFiltrados, setFrentesFiltrados] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCd9axN-90rSSTdZE97zYjXcz_yYydF_gk",
  });

  // Cargar frentes usando frenteService
  const cargarFrentes = async () => {
    try {
      const data = await obtenerFrentesTrabajo();
      setFrentes(data);
    } catch (error) {
      console.error("Error al cargar frentes:", error);
      setFrentes([]);
    }
  };

  useEffect(() => {
    cargarFrentes();
  }, []);

  // Filtrado de frentes
  useEffect(() => {
    const filtro = normalize(busquedaFrente);
    if (!filtro) {
      setFrentesFiltrados([]);
      return;
    }
    const filtrados = frentes.filter((f) =>
      normalize(f.nombre).includes(filtro) || String(f.id).includes(filtro)
    );
    setFrentesFiltrados(filtrados);
  }, [busquedaFrente, frentes]);

  const handleClickMapa = (e) => {
    setPosicion({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!posicion) {
      setMensaje("Selecciona una ubicación en el mapa.");
      return;
    }

    const frente = {
      nombre,
      centroCosto,
      latitudCentro: posicion.lat,
      longitudCentro: posicion.lng,
      radioMetros: radio,
      creadoPorCedulaCapataz: usuario?.cedula || "1234567890",
    };

    try {
      const response = await crearFrenteTrabajo(frente);
      setMensaje(`✅ Frente número ${response.id} creado con éxito.`);
      setNombre("");
      setCentroCosto("");
      setPosicion(null);
      setRadio(50);
      setBusquedaFrente("");
      setFrentesFiltrados([]);
      await cargarFrentes();
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al crear frente.");
    }
  };

  if (!isLoaded) return <p className="crear-frente-container">Cargando mapa...</p>;

  return (
    <div className="crear-frente-container">
      <div className="crear-frente-card">
        <h2>Crear Frente de Trabajo</h2>

        <form onSubmit={handleSubmit} className="crear-frente-form">
          <input type="text" placeholder="Nombre del Frente" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="text" placeholder="Centro de Costo" value={centroCosto} onChange={(e) => setCentroCosto(e.target.value)} required />
          <input type="number" placeholder="Radio en metros" value={radio} onChange={(e) => setRadio(Number(e.target.value))} min="10" max="500" required />
          <button type="submit">Crear Frente</button>
        </form>

        <div className="mapa-container">
          <GoogleMap mapContainerStyle={containerStyle} center={centerBogota} zoom={15} onClick={handleClickMapa}>
            {posicion && (
              <>
                <Marker position={posicion} />
                <Circle center={posicion} radius={radio} options={{ strokeColor: "#f8c400" }} />
              </>
            )}
          </GoogleMap>
        </div>

        <p className="crear-frente-mensaje">{mensaje}</p>

        <div className="trabajadores-section">
          <h3>Buscar Frentes Existentes</h3>
          <input
            className="buscar-frente-input"
            type="text"
            placeholder="Buscar por nombre o ID"
            value={busquedaFrente}
            onChange={(e) => setBusquedaFrente(e.target.value)}
          />

          {frentesFiltrados.length > 0 && (
            <table className="tabla-frentes">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Centro de Costo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {frentesFiltrados.map((f) => (
                  <tr key={f.id} className={f.estado === "APAGADO" ? "frente-apagado" : ""}>
                    <td>{f.id}</td>
                    <td>{f.nombre}</td>
                    <td>{f.centroCosto}</td>
                    <td>{f.estado}</td>
                    <td>
                      <button disabled={f.estado === "APAGADO"}>Editar</button>
                      <button disabled={f.estado === "APAGADO"}>Apagar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrearFrente;
