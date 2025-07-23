import React, { useState } from 'react';
import employeeService from '../services/employeeService';
import '../styles/RegistroEmpleado.css';

const RegistroEmpleado = () => {
  const [empleado, setEmpleado] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    diaNacimiento: '',
    mesNacimiento: '',
    anioNacimiento: '',
    cedula: '',
    celular: '',
    direccion: '',
    barrio: '',
    arl: '',
    eps: '',
    fondoPensiones: '',
    fondoCesantias: '',
    tallaCamisa: '',
    tallaPantalon: '',
    tallaCalzado: '',
    numeroHijos: '',
    tipoSangre: '',
    banco: '',
    numeroCuenta: '',
    tipoCuenta: '',
    contactoEmergencia: '',
    telefonoContactoEmergencia: '',
    email: '',
    password: '',
    rol: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleado({ ...empleado, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevo = await employeeService.create({
        ...empleado,
        diaNacimiento: parseInt(empleado.diaNacimiento),
        mesNacimiento: parseInt(empleado.mesNacimiento),
        anioNacimiento: parseInt(empleado.anioNacimiento),
        numeroHijos: parseInt(empleado.numeroHijos),
      });
      setMensaje(`✅ Empleado ${empleado.primerNombre} ${empleado.primerApellido} registrado correctamente.`);
      setEmpleado({
        primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
        diaNacimiento: '', mesNacimiento: '', anioNacimiento: '', cedula: '', celular: '',
        direccion: '', barrio: '', arl: '', eps: '', fondoPensiones: '', fondoCesantias: '',
        tallaCamisa: '', tallaPantalon: '', tallaCalzado: '', numeroHijos: '', tipoSangre: '',
        banco: '', numeroCuenta: '', tipoCuenta: '', contactoEmergencia: '',
        telefonoContactoEmergencia: '', email: '', password: '', rol: ''
      });
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al registrar empleado.');
    }
  };

  return (
    <div className="registro-empleado-page">
      <div className="registro-empleado-card">
        <h2>Registro de Empleado</h2>
        <form className="registro-empleado-form" onSubmit={handleSubmit}>
          {/* Datos Personales */}
          <label>Primer Nombre</label>
          <input name="primerNombre" value={empleado.primerNombre} onChange={handleChange} required />
          
          <label>Segundo Nombre</label>
          <input name="segundoNombre" value={empleado.segundoNombre} onChange={handleChange} />

          <label>Primer Apellido</label>
          <input name="primerApellido" value={empleado.primerApellido} onChange={handleChange} required />

          <label>Segundo Apellido</label>
          <input name="segundoApellido" value={empleado.segundoApellido} onChange={handleChange} />

          {/* Fecha Nacimiento */}
          <label>Fecha de Nacimiento (Día / Mes / Año)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" name="diaNacimiento" placeholder="Día" value={empleado.diaNacimiento} onChange={handleChange} required />
            <input type="number" name="mesNacimiento" placeholder="Mes" value={empleado.mesNacimiento} onChange={handleChange} required />
            <input type="number" name="anioNacimiento" placeholder="Año" value={empleado.anioNacimiento} onChange={handleChange} required />
          </div>

          {/* Contacto */}
          <label>Cédula</label>
          <input name="cedula" value={empleado.cedula} onChange={handleChange} required />

          <label>Celular</label>
          <input name="celular" value={empleado.celular} onChange={handleChange} required />

          <label>Dirección</label>
          <input name="direccion" value={empleado.direccion} onChange={handleChange} required />

          <label>Barrio</label>
          <input name="barrio" value={empleado.barrio} onChange={handleChange} required />

          {/* Seguridad Social */}
          <label>ARL</label>
          <input name="arl" value={empleado.arl} onChange={handleChange} />

          <label>EPS</label>
          <input name="eps" value={empleado.eps} onChange={handleChange} />

          <label>Fondo de Pensiones</label>
          <input name="fondoPensiones" value={empleado.fondoPensiones} onChange={handleChange} />

          <label>Fondo de Cesantías</label>
          <input name="fondoCesantias" value={empleado.fondoCesantias} onChange={handleChange} />

          {/* Tallas */}
          <label>Talla Camisa</label>
          <input name="tallaCamisa" value={empleado.tallaCamisa} onChange={handleChange} />

          <label>Talla Pantalón</label>
          <input name="tallaPantalon" value={empleado.tallaPantalon} onChange={handleChange} />

          <label>Talla Calzado</label>
          <input name="tallaCalzado" value={empleado.tallaCalzado} onChange={handleChange} />

          {/* Familia y Salud */}
          <label>Número de Hijos</label>
          <input type="number" name="numeroHijos" value={empleado.numeroHijos} onChange={handleChange} />

          <label>Tipo de Sangre</label>
          <input name="tipoSangre" value={empleado.tipoSangre} onChange={handleChange} />

          {/* Bancario */}
          <label>Banco</label>
          <input name="banco" value={empleado.banco} onChange={handleChange} />

          <label>Número de Cuenta</label>
          <input name="numeroCuenta" value={empleado.numeroCuenta} onChange={handleChange} />

          <label>Tipo de Cuenta</label>
          <input name="tipoCuenta" value={empleado.tipoCuenta} onChange={handleChange} />

          {/* Emergencia */}
          <label>Contacto de Emergencia</label>
          <input name="contactoEmergencia" value={empleado.contactoEmergencia} onChange={handleChange} />

          <label>Teléfono de Emergencia</label>
          <input name="telefonoContactoEmergencia" value={empleado.telefonoContactoEmergencia} onChange={handleChange} />

          {/* Acceso */}
          <label>Email</label>
          <input type="email" name="email" value={empleado.email} onChange={handleChange} required />

          <label>Contraseña</label>
          <input type="password" name="password" value={empleado.password} onChange={handleChange} required />

          <label>Rol</label>
          <select name="rol" value={empleado.rol} onChange={handleChange} required>
            <option value="">Selecciona un rol</option>
            <option value="TRABAJADOR">Trabajador</option>
            <option value="CAPATAZ">Capataz</option>
            <option value="JEFE_OBRA">Jefe de Obra</option>
            <option value="RRHH">RRHH</option>
          </select>

          <button type="submit">Registrar</button>
        </form>

        {mensaje && <p style={{ marginTop: '1rem', color: 'var(--color-primary)' }}>{mensaje}</p>}
      </div>
    </div>
  );
};

export default RegistroEmpleado;
