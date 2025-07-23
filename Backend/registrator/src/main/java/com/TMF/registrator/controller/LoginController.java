package com.TMF.registrator.controller;

import com.TMF.registrator.dto.LoginRequest;
import com.TMF.registrator.dto.LoginResponse;
import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Usuario usuario = usuarioService.autenticarUsuario(loginRequest.getCedula(), loginRequest.getPassword());
        if (usuario != null) {
            return ResponseEntity.ok(new LoginResponse(true, "Login exitoso", usuario.getRol(), usuario.getPrimerNombre(), usuario.getCedula()));
        } else {
            return ResponseEntity.status(401).body(new LoginResponse(false, "Cédula o contraseña incorrecta", null, null, null));
        }
    }
}
