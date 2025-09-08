package com.TMF.registrator.service.auth;

import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepo;

    public AppUserDetailsService(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String cedula = username == null ? "" : username.trim();
        Usuario u = usuarioRepo.findByCedula(cedula)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + cedula));
        return new AppUserDetails(u);
    }
}
