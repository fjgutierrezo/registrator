import React, { useEffect, useState } from 'react';
import employeeService from '../services/employeeService';
import '../styles/ListaEmpleados.css';

const ListaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [editandoCedula, setEditandoCedula] = useState(null);
  const [formEdit, setFormEdit] = useState({});

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const data = await employeeService.getAll();
        const ordenados = [...data].sort((a, b) => {
          const nombreA = `${a.primerApellido} ${a.segundoApellido} ${a.primerNombre} ${a.segundoNombre}`.toLowerCase();
          const nombreB = `${b.primerApellido} ${b.segundoApellido} ${b.primerNombre} ${b.segundoNombre}`.toLowerCase();
          return nombreA.localeCompare(nombreB);
        });
        setEmpleados(ordenados);
      } catch (error) {
        console.error('Error al cargar empleados:', error);
      }
    };

    fetchEmpleados();
  }, []);

  const toggleExpand = (cedula) => {
    setExpandido((prev) => (prev === cedula ? null : cedula));
    setEditandoCedula(null); // si expandimos/cerramos, cancelamos edición
  };

  const handleEditarClick = (empleado) => {
    setEditandoCedula(empleado.cedula);
    setFormEdit({ ...empleado });
    setExpandido(empleado.cedula); // aseguramos que esté expandido
  };

  const handleCancelar = () => {
    setEditandoCedula(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      // Convertir campos numéricos si es necesario
      const payload = {
        ...formEdit,
        diaNacimiento: parseInt(formEdit.diaNacimiento),
        mesNacimiento: parseInt(formEdit.mesNacimiento),
        anioNacimiento: parseInt(formEdit.anioNacimiento),
        numeroHijos: parseInt(formEdit.numeroHijos),
      };
      await employeeService.update(formEdit.cedula, payload);

      // Actualizar la lista localmente sin recargar todo
      setEmpleados((prev) =>
        prev.map((e) => (e.cedula === formEdit.cedula ? payload : e))
      );

      setEditandoCedula(null);
      alert('Empleado actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar empleado');
      console.error(error);
    }
  };

  const handleEliminar = async (empleado) => {
    if (window.confirm(`¿Eliminar empleado ${empleado.primerNombre} ${empleado.primerApellido}?`)) {
      try {
        await employeeService.remove(empleado.cedula);
        setEmpleados((prev) => prev.filter(e => (e.cedula) !== (empleado.cedula)));
      } catch (error) {
        alert('Error al eliminar empleado');
        console.error(error);
      }
    }
  };

  return (
    <div className="lista-empleados-page">
      <div className="lista-empleados-card">
        <h2>Empleados Registrados</h2>
        <div className="lista-empleados-tabla">
          {empleados.map((e) => {
            const nombreCompleto = `${e.primerApellido} ${e.segundoApellido} ${e.primerNombre} ${e.segundoNombre}`;

            return (
              <div key={e.cedula} className="empleado-row">
                <div className="empleado-resumen" onClick={() => toggleExpand(e.cedula)}>
                  <span className="empleado-nombre">{nombreCompleto}</span>
                  <span className="empleado-rol">{e.rol}</span>

                  <div
                    className="empleado-botones"
                    onClick={(evt) => evt.stopPropagation()}
                  >
                    <button
                      className="btn-editar"
                      onClick={() => handleEditarClick(e)}
                      title="Editar"
                      aria-label={`Editar empleado ${nombreCompleto}`}
                    >
                      🖉
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(e)}
                      title="Eliminar"
                      aria-label={`Eliminar empleado ${nombreCompleto}`}
                    >
                      ✖
                    </button>
                  </div>
                </div>

                {expandido === e.cedula && (
                  <div className="empleado-detalle">
                    {editandoCedula === e.cedula ? (
                      <>
                        {/* Inputs editables */}
                        <label>Primer Nombre</label>
                        <input name="primerNombre" value={formEdit.primerNombre} onChange={handleChange} />

                        <label>Segundo Nombre</label>
                        <input name="segundoNombre" value={formEdit.segundoNombre} onChange={handleChange} />

                        <label>Primer Apellido</label>
                        <input name="primerApellido" value={formEdit.primerApellido} onChange={handleChange} />

                        <label>Segundo Apellido</label>
                        <input name="segundoApellido" value={formEdit.segundoApellido} onChange={handleChange} />

                        <label>Fecha de Nacimiento (Día / Mes / Año)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input type="number" name="diaNacimiento" value={formEdit.diaNacimiento} onChange={handleChange} />
                          <input type="number" name="mesNacimiento" value={formEdit.mesNacimiento} onChange={handleChange} />
                          <input type="number" name="anioNacimiento" value={formEdit.anioNacimiento} onChange={handleChange} />
                        </div>

                        <label>Celular</label>
                        <input name="celular" value={formEdit.celular} onChange={handleChange} />

                        <label>Dirección</label>
                        <input name="direccion" value={formEdit.direccion} onChange={handleChange} />

                        <label>Barrio</label>
                        <input name="barrio" value={formEdit.barrio} onChange={handleChange} />

                        <label>ARL</label>
                        <input name="arl" value={formEdit.arl} onChange={handleChange} />

                        <label>EPS</label>
                        <input name="eps" value={formEdit.eps} onChange={handleChange} />

                        <label>Fondo de Pensiones</label>
                        <input name="fondoPensiones" value={formEdit.fondoPensiones} onChange={handleChange} />

                        <label>Fondo de Cesantías</label>
                        <input name="fondoCesantias" value={formEdit.fondoCesantias} onChange={handleChange} />

                        <label>Talla Camisa</label>
                        <input name="tallaCamisa" value={formEdit.tallaCamisa} onChange={handleChange} />

                        <label>Talla Pantalón</label>
                        <input name="tallaPantalon" value={formEdit.tallaPantalon} onChange={handleChange} />

                        <label>Talla Calzado</label>
                        <input name="tallaCalzado" value={formEdit.tallaCalzado} onChange={handleChange} />

                        <label>Número de Hijos</label>
                        <input type="number" name="numeroHijos" value={formEdit.numeroHijos} onChange={handleChange} />

                        <label>Tipo de Sangre</label>
                        <input name="tipoSangre" value={formEdit.tipoSangre} onChange={handleChange} />

                        <label>Banco</label>
                        <input name="banco" value={formEdit.banco} onChange={handleChange} />

                        <label>Número de Cuenta</label>
                        <input name="numeroCuenta" value={formEdit.numeroCuenta} onChange={handleChange} />

                        <label>Tipo de Cuenta</label>
                        <input name="tipoCuenta" value={formEdit.tipoCuenta} onChange={handleChange} />

                        <label>Contacto de Emergencia</label>
                        <input name="contactoEmergencia" value={formEdit.contactoEmergencia} onChange={handleChange} />

                        <label>Teléfono de Emergencia</label>
                        <input name="telefonoContactoEmergencia" value={formEdit.telefonoContactoEmergencia} onChange={handleChange} />

                        <label>Email</label>
                        <input type="email" name="email" value={formEdit.email} onChange={handleChange} />

                        <label>Rol</label>
                        <select name="rol" value={formEdit.rol} onChange={handleChange}>
                          <option value="">Selecciona un rol</option>
                          <option value="TRABAJADOR">Trabajador</option>
                          <option value="CAPATAZ">Capataz</option>
                          <option value="JEFE_OBRA">Jefe de Obra</option>
                          <option value="RRHH">RRHH</option>
                        </select>

                        <div style={{ marginTop: '1rem' }}>
                          <button onClick={handleGuardar} style={{ marginRight: '1rem' }}>Guardar</button>
                          <button onClick={handleCancelar}>Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Vista normal con datos */}
                        <p><strong>Cédula:</strong> {e.cedula}</p>
                        <p><strong>Teléfono:</strong> {e.celular}</p>
                        <p><strong>Correo:</strong> {e.email}</p>
                        <p><strong>Dirección:</strong> {e.direccion}, {e.barrio}</p>
                        <p><strong>Fecha de nacimiento:</strong> {e.diaNacimiento}/{e.mesNacimiento}/{e.anioNacimiento}</p>
                        <p><strong>Tallas:</strong> Camisa {e.tallaCamisa}, Pantalón {e.tallaPantalon}, Calzado {e.tallaCalzado}</p>
                        <p><strong>ARL:</strong> {e.arl} | <strong>EPS:</strong> {e.eps}</p>
                        <p><strong>Pensiones:</strong> {e.fondoPensiones} | <strong>Cesantías:</strong> {e.fondoCesantias}</p>
                        <p><strong>Número de hijos:</strong> {e.numeroHijos}</p>
                        <p><strong>Tipo de sangre:</strong> {e.tipoSangre}</p>
                        <p><strong>Banco:</strong> {e.banco}, {e.tipoCuenta} {e.numeroCuenta}</p>
                        <p><strong>Contacto Emergencia:</strong> {e.contactoEmergencia} - {e.telefonoContactoEmergencia}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListaEmpleados;
