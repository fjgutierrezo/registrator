package com.TMF.registrator.controller;
import com.TMF.registrator.dto.RegistroEmpleadoRequest;
import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/rrhh")
public class RRHHController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/empleados")
    public ResponseEntity<String> registrarEmpleado(@Valid @RequestBody RegistroEmpleadoRequest request) {

        // Validación: Cédula ya existente
        if (usuarioService.cedulaExiste(request.getCedula())) {
            return ResponseEntity.badRequest().body("❌ Ya existe un empleado con esa cédula.");
        }

        // Advertencia: nombre completo igual, pero diferente cédula
        if (usuarioService.nombreCoincide(request.getPrimerNombre(), request.getPrimerApellido())) {
            System.out.println("⚠ Advertencia: Ya existe una persona con el mismo nombre y apellido, pero diferente cédula.");
        }

        // Crear objeto Usuario y asignar campos
        Usuario nuevo = new Usuario();
        nuevo.setPrimerNombre(request.getPrimerNombre());
        nuevo.setSegundoNombre(request.getSegundoNombre());
        nuevo.setPrimerApellido(request.getPrimerApellido());
        nuevo.setSegundoApellido(request.getSegundoApellido());
        nuevo.setDiaNacimiento(request.getDiaNacimiento());
        nuevo.setMesNacimiento(request.getMesNacimiento());
        nuevo.setAnioNacimiento(request.getAnioNacimiento());
        nuevo.setCedula(request.getCedula());
        nuevo.setCelular(request.getCelular());
        nuevo.setDireccion(request.getDireccion());
        nuevo.setBarrio(request.getBarrio());
        nuevo.setArl(request.getArl());
        nuevo.setEps(request.getEps());
        nuevo.setFondoPensiones(request.getFondoPensiones());
        nuevo.setFondoCesantias(request.getFondoCesantias());
        nuevo.setTallaCamisa(request.getTallaCamisa());
        nuevo.setTallaPantalon(request.getTallaPantalon());
        nuevo.setTallaCalzado(request.getTallaCalzado());
        nuevo.setNumeroHijos(request.getNumeroHijos());
        nuevo.setTipoSangre(request.getTipoSangre());
        nuevo.setBanco(request.getBanco());
        nuevo.setNumeroCuenta(request.getNumeroCuenta());
        nuevo.setTipoCuenta(request.getTipoCuenta());
        nuevo.setContactoEmergencia(request.getContactoEmergencia());
        nuevo.setTelefonoContactoEmergencia(request.getTelefonoContactoEmergencia());
        nuevo.setEmail(request.getEmail());
        nuevo.setPassword(request.getPassword());
        nuevo.setRol(request.getRol());

        // Guardar en base de datos
        usuarioService.guardarUsuario(nuevo);

        return ResponseEntity.ok("✅ Empleado registrado correctamente.");
    }
    @GetMapping("/empleados")
    public ResponseEntity<List<Usuario>> listarEmpleados() {
        List<Usuario> empleados = usuarioService.obtenerTodosLosEmpleados();
        return ResponseEntity.ok(empleados);
    }
    // 🔍 Buscar por cédula
    @GetMapping("/empleados/cedula/{cedula}")
    public ResponseEntity<?> buscarPorCedula(@PathVariable String cedula) {
        Optional<Usuario> usuario = usuarioService.buscarPorCedula(cedula);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(404).body("Empleado no encontrado con cédula: " + cedula);
        }
    }



    // 🔍 Buscar por nombre y apellido
    @GetMapping("/empleados/nombre")
    public ResponseEntity<?> buscarPorNombreYApellido(
            @RequestParam String primerNombre,
            @RequestParam String primerApellido
    ) {
        List<Usuario> resultados = usuarioService.buscarPorNombreYApellido(primerNombre, primerApellido);
        if (resultados.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontraron empleados con ese nombre y apellido.");
        }
        return ResponseEntity.ok(resultados);
    }
    @PutMapping("/empleados/{cedula}")
    public ResponseEntity<?> actualizarEmpleado(
            @PathVariable String cedula,
            @RequestBody RegistroEmpleadoRequest request
    ) {
        return usuarioService.actualizarEmpleado(cedula, request);
    }
    @DeleteMapping("/empleados/{cedula}")
    public ResponseEntity<String> eliminarEmpleado(@PathVariable String cedula) {
        String resultado = usuarioService.eliminarEmpleadoPorCedula(cedula);
        if (resultado.contains("eliminado correctamente")) {
            return ResponseEntity.ok(resultado);
        } else {
            return ResponseEntity.status(404).body(resultado);
        }
    }
    @GetMapping("/trabajadores")
    public List<Usuario> obtenerTrabajadores() {
        return usuarioService.obtenerPorRol("Trabajador");
    }
  /*  @GetMapping("/trabajadores-disponibles")
    public List<Usuario> obtenerTrabajadoresDisponibles() {
        return usuarioService.obtenerTrabajadoresNoAsignados();
    }*/


}
