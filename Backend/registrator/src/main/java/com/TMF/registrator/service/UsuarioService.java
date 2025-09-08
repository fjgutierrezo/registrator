package com.TMF.registrator.service;

import com.TMF.registrator.dto.RegistroEmpleadoRequest;
import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;


@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    public boolean cedulaExiste(String cedula) {
        return usuarioRepository.findByCedula(cedula).isPresent();
    }

    public boolean nombreCoincide(String primerNombre, String primerApellido) {
        return usuarioRepository
                .findByPrimerNombreAndPrimerApellido(primerNombre, primerApellido)
                .size() > 0;
    }

    public List<Usuario> obtenerTodosLosEmpleados() {
        return usuarioRepository.findAll();
    }
    public Optional<Usuario> buscarPorCedula(String cedula) {
        return usuarioRepository.findByCedula(cedula);
    }

    public List<Usuario> buscarPorNombreYApellido(String nombre, String apellido) {
        return usuarioRepository.findByPrimerNombreAndPrimerApellido(nombre, apellido);
    }
    public ResponseEntity<?> actualizarEmpleado(String cedula, RegistroEmpleadoRequest request) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByCedula(cedula);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontró ningún empleado con la cédula: " + cedula);
        }

        Usuario usuario = usuarioOptional.get();

        // Actualizar los campos uno por uno
        usuario.setPrimerNombre(request.getPrimerNombre());
        usuario.setSegundoNombre(request.getSegundoNombre());
        usuario.setPrimerApellido(request.getPrimerApellido());
        usuario.setSegundoApellido(request.getSegundoApellido());
        usuario.setDiaNacimiento(request.getDiaNacimiento());
        usuario.setMesNacimiento(request.getMesNacimiento());
        usuario.setAnioNacimiento(request.getAnioNacimiento());
        usuario.setCelular(request.getCelular());
        usuario.setDireccion(request.getDireccion());
        usuario.setBarrio(request.getBarrio());
        usuario.setArl(request.getArl());
        usuario.setEps(request.getEps());
        usuario.setFondoPensiones(request.getFondoPensiones());
        usuario.setFondoCesantias(request.getFondoCesantias());
        usuario.setTallaCamisa(request.getTallaCamisa());
        usuario.setTallaPantalon(request.getTallaPantalon());
        usuario.setTallaCalzado(request.getTallaCalzado());
        usuario.setNumeroHijos(request.getNumeroHijos());
        usuario.setTipoSangre(request.getTipoSangre());
        usuario.setBanco(request.getBanco());
        usuario.setNumeroCuenta(request.getNumeroCuenta());
        usuario.setTipoCuenta(request.getTipoCuenta());
        usuario.setContactoEmergencia(request.getContactoEmergencia());
        usuario.setTelefonoContactoEmergencia(request.getTelefonoContactoEmergencia());
        usuario.setSalario(request.getSalario());
        usuario.setBonificacion(request.getBonificacion());
        usuario.setAuxilioTransporte(request.getAuxilioTransporte());
        usuario.setRol(request.getRol());

        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Empleado actualizado correctamente.");
    }
    public String eliminarEmpleadoPorCedula(String cedula) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByCedula(cedula);
        if (usuarioOptional.isPresent()) {
            usuarioRepository.delete(usuarioOptional.get());
            return "Empleado con cédula " + cedula + " eliminado correctamente.";
        } else {
            return "Empleado no encontrado con la cédula: " + cedula;
        }
    }
    public Usuario autenticarUsuario(String cedula, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCedula(cedula);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(password)) {
                return usuario;
            }
        }
        return null;
    }
    public List<Usuario> obtenerPorRol(String rol) {
        return usuarioRepository.findByRol(rol);
    }

  /*  public List<Usuario> obtenerTrabajadoresNoAsignados() {
        return usuarioRepository.findTrabajadoresNoAsignados("Trabajador");
    }*/

}
