import React, { useEffect, useState } from 'react';
import employeeService from '../services/empleadoService';
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
    setEditandoCedula(null); // al expandir/cerrar, salimos de edición
  };

  const handleEditarClick = (empleado) => {
    setEditandoCedula(empleado.cedula);
    // Seed del formulario incluyendo campos de nómina (por si vienen null/undefined)
    setFormEdit({
      ...empleado,
      salario: empleado.salario ?? '',
      bonificacion: empleado.bonificacion ?? '',
      auxilioTransporte: empleado.auxilioTransporte ?? '',
    });
    setExpandido(empleado.cedula);
  };
  const handleEliminar = async (empleado) => {
    if (window.confirm(`¿Eliminar empleado ${empleado.primerNombre} ${empleado.primerApellido}?`)) {
      try {
        await employeeService.remove(empleado.cedula);
        setEmpleados((prev) => prev.filter((x) => x.cedula !== empleado.cedula));
        // si el que se eliminó estaba expandido, lo cerramos
        setExpandido((prev) => (prev === empleado.cedula ? null : prev));
        alert('Empleado eliminado correctamente');
      } catch (error) {
        console.error(error);
        alert('Error al eliminar empleado');
      }
    }
  };
 

  const handleCancelar = () => {
    setEditandoCedula(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({ ...prev, [name]: value }));
  };

  const toNumberOrNull = (v) => {
    if (v === null || v === undefined) return null;
    const s = String(v).replaceAll(',', '.').trim();
    if (s === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  const handleGuardar = async () => {
    try {
      const payload = {
        ...formEdit,
        diaNacimiento: parseInt(formEdit.diaNacimiento, 10),
        mesNacimiento: parseInt(formEdit.mesNacimiento, 10),
        anioNacimiento: parseInt(formEdit.anioNacimiento, 10),
        numeroHijos: parseInt(formEdit.numeroHijos || 0, 10),
        // 💰 enviar como número (el backend mapea a BigDecimal)
        salario: toNumberOrNull(formEdit.salario),
        bonificacion: toNumberOrNull(formEdit.bonificacion),
        auxilioTransporte: toNumberOrNull(formEdit.auxilioTransporte),
      };

      await employeeService.update(formEdit.cedula, payload);

      // Actualizar la lista localmente
      setEmpleados((prev) =>
        prev.map((e) => (e.cedula === formEdit.cedula ? { ...e, ...payload } : e))
      );

      setEditandoCedula(null);
      alert('Empleado actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar empleado');
      console.error(error);
    }
  };

  const fmtCOP = (n) =>
    Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
      .format(Number(n || 0));

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
                        <input name="primerNombre" value={formEdit.primerNombre || ''} onChange={handleChange} />

                        <label>Segundo Nombre</label>
                        <input name="segundoNombre" value={formEdit.segundoNombre || ''} onChange={handleChange} />

                        <label>Primer Apellido</label>
                        <input name="primerApellido" value={formEdit.primerApellido || ''} onChange={handleChange} />

                        <label>Segundo Apellido</label>
                        <input name="segundoApellido" value={formEdit.segundoApellido || ''} onChange={handleChange} />

                        <label>Fecha de Nacimiento (Día / Mes / Año)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input type="number" name="diaNacimiento" value={formEdit.diaNacimiento || ''} onChange={handleChange} />
                          <input type="number" name="mesNacimiento" value={formEdit.mesNacimiento || ''} onChange={handleChange} />
                          <input type="number" name="anioNacimiento" value={formEdit.anioNacimiento || ''} onChange={handleChange} />
                        </div>

                        <label>Celular</label>
                        <input name="celular" value={formEdit.celular || ''} onChange={handleChange} />

                        <label>Dirección</label>
                        <input name="direccion" value={formEdit.direccion || ''} onChange={handleChange} />

                        <label>Barrio</label>
                        <input name="barrio" value={formEdit.barrio || ''} onChange={handleChange} />

                        <label>ARL</label>
                        <input name="arl" value={formEdit.arl || ''} onChange={handleChange} />

                        <label>EPS</label>
                        <input name="eps" value={formEdit.eps || ''} onChange={handleChange} />

                        <label>Fondo de Pensiones</label>
                        <input name="fondoPensiones" value={formEdit.fondoPensiones || ''} onChange={handleChange} />

                        <label>Fondo de Cesantías</label>
                        <input name="fondoCesantias" value={formEdit.fondoCesantias || ''} onChange={handleChange} />

                        <label>Talla Camisa</label>
                        <input name="tallaCamisa" value={formEdit.tallaCamisa || ''} onChange={handleChange} />

                        <label>Talla Pantalón</label>
                        <input name="tallaPantalon" value={formEdit.tallaPantalon || ''} onChange={handleChange} />

                        <label>Talla Calzado</label>
                        <input name="tallaCalzado" value={formEdit.tallaCalzado || ''} onChange={handleChange} />

                        <label>Número de Hijos</label>
                        <input type="number" name="numeroHijos" value={formEdit.numeroHijos || ''} onChange={handleChange} />

                        <label>Tipo de Sangre</label>
                        <input name="tipoSangre" value={formEdit.tipoSangre || ''} onChange={handleChange} />

                        <label>Banco</label>
                        <input name="banco" value={formEdit.banco || ''} onChange={handleChange} />

                        <label>Número de Cuenta</label>
                        <input name="numeroCuenta" value={formEdit.numeroCuenta || ''} onChange={handleChange} />

                        <label>Tipo de Cuenta</label>
                        <input name="tipoCuenta" value={formEdit.tipoCuenta || ''} onChange={handleChange} />

                        <label>Contacto de Emergencia</label>
                        <input name="contactoEmergencia" value={formEdit.contactoEmergencia || ''} onChange={handleChange} />

                        <label>Teléfono de Emergencia</label>
                        <input name="telefonoContactoEmergencia" value={formEdit.telefonoContactoEmergencia || ''} onChange={handleChange} />

                        <label>Email</label>
                        <input type="email" name="email" value={formEdit.email || ''} onChange={handleChange} />

                        <label>Rol</label>
                        <select name="rol" value={formEdit.rol || ''} onChange={handleChange}>
                          <option value="">Selecciona un rol</option>
                          <option value="TRABAJADOR">Trabajador</option>
                          <option value="CAPATAZ">Capataz</option>
                          <option value="JEFE_OBRA">Jefe de Obra</option>
                          <option value="RRHH">RRHH</option>
                        </select>

                        {/* ===== DATOS DE NÓMINA ===== */}
                        <hr />
                        <h3>Datos de nómina</h3>

                        <label>Salario (COP)</label>
                        <input
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          name="salario"
                          value={formEdit.salario}
                          onChange={handleChange}
                          placeholder="Ej: 1600000.00"
                        />

                        <label>Bonificación (COP)</label>
                        <input
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          name="bonificacion"
                          value={formEdit.bonificacion}
                          onChange={handleChange}
                          placeholder="Ej: 200000.00"
                        />

                        <label>Auxilio de transporte (COP)</label>
                        <input
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          name="auxilioTransporte"
                          value={formEdit.auxilioTransporte}
                          onChange={handleChange}
                          placeholder="Ej: 162000.00"
                        />

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

                        {/* Mostrar nómina en vista normal */}
                        <hr />
                        <p><strong>Salario:</strong> {fmtCOP(e.salario)}</p>
                        <p><strong>Bonificación:</strong> {fmtCOP(e.bonificacion)}</p>
                        <p><strong>Auxilio de transporte:</strong> {fmtCOP(e.auxilioTransporte)}</p>
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
