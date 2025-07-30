import React, { useState, useContext } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle } from "@react-google-maps/api";
import "../styles/CrearFrente.css";
import { AuthContext } from "../utils/AuthContext";
import { crearFrenteTrabajo } from "../services/frenteService";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerBogota = {
  lat: 4.60971,
  lng: -74.08175,
};

function CrearFrente() {
  const { usuario, perfil } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [centroCosto, setCentroCosto] = useState("");
  const [radio, setRadio] = useState(50);
  const [posicion, setPosicion] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCd9axN-90rSSTdZE97zYjXcz_yYydF_gk",
  });

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
      creadoPorCedulaCapataz: usuario?.cedula || "1234567890"
    };
    

    try {
      const response = await crearFrenteTrabajo(frente); // ✅ llamado al servicio separado
      setMensaje("✅ Frente creado con éxito.");
      console.log(response);
    } catch (err) {
      setMensaje("❌ Error al crear frente.");
    }
  };

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
            {posicion && (
              <>
                <Marker position={posicion} />
                <Circle center={posicion} radius={radio} options={{ strokeColor: "#f8c400" }} />
              </>
            )}
          </GoogleMap>
        </div>

        <p className="crear-frente-mensaje">{mensaje}</p>
      </div>
    </div>
  );
}

export default CrearFrente;
