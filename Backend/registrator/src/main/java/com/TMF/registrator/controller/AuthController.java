package com.TMF.registrator.controller;

import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Permite recibir peticiones desde el frontend (React)
public class AuthController {

    private final UsuarioService usuarioService;

    @Autowired
    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Endpoint para login
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOptional = usuarioService.buscarPorEmail(loginRequest.getEmail());

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            // En este punto la contraseña debería estar encriptada, pero aún no usamos seguridad
            if (usuario.getPassword().equals(loginRequest.getPassword())) {
                return "Login correcto. Rol: " + usuario.getRol();
            } else {
                return "Contraseña incorrecta.";
            }
        } else {
            return "Usuario no encontrado.";
        }
    }

    // Clase interna para representar el cuerpo del login
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters y Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
