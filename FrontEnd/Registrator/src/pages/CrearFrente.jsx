import React, { useState, useContext, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle } from "@react-google-maps/api";
import "../styles/CrearFrente.css";
import { AuthContext } from "../utils/AuthContext";
import {
  crearFrenteTrabajo,
  obtenerFrentesTrabajo,
  editarFrenteTrabajo,
  actualizarEstadoFrente,
} from "../services/frenteService";

const containerStyle = { width: "100%", height: "400px" };
const centerBogota = { lat: 41.5632, lng: 2.0089 };

const normalize = (s = "") =>
  s.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// 🔒 Asegura que lo que llegue se convierta en array
const asArray = (x) => {
  if (Array.isArray(x)) return x;
  if (!x) return [];
  if (Array.isArray(x.data)) return x.data;
  if (Array.isArray(x.content)) return x.content;
  if (Array.isArray(x.resultado)) return x.resultado;
  return [];
};

function CrearFrente() {
  const { usuario } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [centroCosto, setCentroCosto] = useState("");
  const [radio, setRadio] = useState(50);
  const [posicion, setPosicion] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const [frentes, setFrentes] = useState([]);
  const [busquedaFrente, setBusquedaFrente] = useState("");
  const [frentesFiltrados, setFrentesFiltrados] = useState([]);

  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editCentroCosto, setEditCentroCosto] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);

  // ⚠️ Mantengo tu uso actual (clave inline) para no romper nada.
  // Te recomiendo habilitar facturación en GCP para evitar BillingNotEnabledMapError.
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCd9axN-90rSSTdZE97zYjXcz_yYydF_gk",
  });

  const cargarFrentes = async () => {
    try {
      const data = await obtenerFrentesTrabajo();
      // data puede ser axios resp (con .data) o el array directo
      const arr = asArray(data?.data ?? data);
      setFrentes(arr);
    } catch (error) {
      console.error("Error al cargar frentes:", error);
      setFrentes([]);
    }
  };

  useEffect(() => {
    cargarFrentes();
  }, []);

  useEffect(() => {
    const filtro = normalize(busquedaFrente);
    if (!filtro) {
      setFrentesFiltrados([]);
      return;
    }
    const fuente = asArray(frentes);
    setFrentesFiltrados(
      fuente.filter(
        (f) => normalize(f?.nombre ?? "").includes(filtro) || String(f?.id ?? "").includes(filtro)
      )
    );
  }, [busquedaFrente, frentes]);

  const handleClickMapa = (e) => {
    if (!e || !e.latLng) return;
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
      // soporta axios ({data:{id}}) o fetch directo ({id})
      const nuevoId = response?.data?.id ?? response?.id ?? "—";
      setMensaje(`✅ Frente número ${nuevoId} creado con éxito.`);
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

  const iniciarEdicion = (frente) => {
    setEditandoId(frente.id);
    setEditNombre(frente.nombre);
    setEditCentroCosto(frente.centroCosto);
  };

  const guardarEdicion = async (id) => {
    try {
      await editarFrenteTrabajo(id, { nombre: editNombre, centroCosto: editCentroCosto });
      setEditandoId(null);
      await cargarFrentes();
    } catch (error) {
      console.error("Error al guardar edición:", error);
    }
  };

  const confirmarAccion = (tipo, id) => {
    setAccionPendiente({ tipo, id });
    setModalVisible(true);
  };

  const ejecutarAccion = async () => {
    if (!accionPendiente) return;
    try {
      await actualizarEstadoFrente(accionPendiente.id, accionPendiente.tipo);
      setModalVisible(false);
      setAccionPendiente(null);
      await cargarFrentes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  if (loadError) {
    return (
      <div className="crear-frente-container">
        <div className="crear-frente-card">
          <h2>Crear Frente de Trabajo</h2>
          <p className="crear-frente-mensaje">
            ⚠️ Error cargando Google Maps. Verifica que tu proyecto de Google Cloud tenga
            <strong> facturación habilitada</strong> y que la API <em>Maps JavaScript API</em> esté activa.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) return <p className="crear-frente-container">Cargando mapa...</p>;

  return (
    <div className="crear-frente-container">
      <div className="crear-frente-card">
        <h2>Crear Frente de Trabajo</h2>
        <form onSubmit={handleSubmit} className="crear-frente-form">
          <input
            type="text"
            placeholder="Nombre del Frente"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Centro de Costo"
            value={centroCosto}
            onChange={(e) => setCentroCosto(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Radio en metros"
            value={radio}
            onChange={(e) => setRadio(Number(e.target.value))}
            min="10"
            max="500"
            required
          />
          <button type="submit">Crear Frente</button>
        </form>

        <div className="mapa-container">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={centerBogota}
            zoom={15}
            onClick={handleClickMapa}
          >
            {/* Marcador de la nueva posición */}
            {posicion && (
              <>
                <Marker position={posicion} />
                <Circle
                  center={posicion}
                  radius={Number(radio) || 0}
                  options={{ strokeColor: "#f8c400" }}
                />
              </>
            )}

            {/* Marcadores de frentes activos existentes */}
            {asArray(frentes)
              .filter((f) => f?.estado === "ACTIVO")
              .map((f) => (
                <React.Fragment key={f.id}>
                  <Marker
                    position={{ lat: f.latitudCentro, lng: f.longitudCentro }}
                    title={`Frente número: ${f.id}\nNombre: ${f.nombre}`}
                  />
                  <Circle
                    center={{ lat: f.latitudCentro, lng: f.longitudCentro }}
                    radius={Number(f.radioMetros) || 0}
                    options={{ strokeColor: "#4285F4", fillOpacity: 0.1 }}
                  />
                </React.Fragment>
              ))}
          </GoogleMap>
        </div>

        <p className="crear-frente-mensaje">{mensaje}</p>

        {/* 🔹 Mantengo tu buscador y tabla intactos */}
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
                  <th colSpan={2}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {frentesFiltrados.map((f) => (
                  <tr key={f.id} className={f.estado === "APAGADO" ? "frente-apagado" : ""}>
                    <td>{f.id}</td>
                    <td>
                      {editandoId === f.id ? (
                        <input
                          value={editNombre}
                          onChange={(e) => setEditNombre(e.target.value)}
                        />
                      ) : (
                        f.nombre
                      )}
                    </td>
                    <td>
                      {editandoId === f.id ? (
                        <input
                          value={editCentroCosto}
                          onChange={(e) => setEditCentroCosto(e.target.value)}
                        />
                      ) : (
                        f.centroCosto
                      )}
                    </td>
                    <td>{f.estado}</td>
                    <td>
                      {editandoId === f.id ? (
                        <button onClick={() => guardarEdicion(f.id)}>Guardar</button>
                      ) : (
                        <button
                          disabled={f.estado === "APAGADO"}
                          onClick={() => iniciarEdicion(f)}
                        >
                          Editar
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        disabled={f.estado === "APAGADO"}
                        onClick={() => confirmarAccion("finalizado", f.id)}
                      >
                        Finalizar
                      </button>
                      <button
                        disabled={f.estado === "APAGADO"}
                        onClick={() => confirmarAccion("apagado", f.id)}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalVisible && (
        <div className="modal-confirmacion">
          <div className="modal-contenido">
            <p>
              {accionPendiente?.tipo === "apagado"
                ? "¿Seguro que quieres borrar (apagar) este frente?"
                : "¿Seguro que quieres finalizar este frente?"}
            </p>
            <button onClick={ejecutarAccion}>Sí</button>
            <button onClick={() => setModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearFrente;
