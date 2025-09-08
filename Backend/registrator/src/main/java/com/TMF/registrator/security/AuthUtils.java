// src/main/java/com/TMF/registrator/security/AuthUtils.java
package com.TMF.registrator.security;

import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.repository.UsuarioRepository;
import com.TMF.registrator.service.auth.AppUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Component;

@Component
public class AuthUtils {
    private final UsuarioRepository usuarioRepo;


    public AuthUtils(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    public Usuario currentUserOrThrow() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("No hay usuario autenticado");
        }
        AppUserDetails principal = (AppUserDetails) auth.getPrincipal();
        return principal.getUsuario();
    }
}
