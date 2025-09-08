// src/main/java/com/TMF/registrator/service/auth/AppUserDetails.java
package com.TMF.registrator.service.auth;

import com.TMF.registrator.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.text.Normalizer;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

public class AppUserDetails implements UserDetails {
    private final Usuario usuario;
    private final List<GrantedAuthority> authorities;

    public AppUserDetails(Usuario usuario) {
        this.usuario = usuario;
        String raw = usuario.getRol() == null ? "" : usuario.getRol().trim();

        // Normaliza: mayúsculas, espacios→_, sin acentos (e.g. “Jefe de Obra” → “JEFE_DE_OBRA”)
        String normalized = Normalizer.normalize(raw, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")           // quita acentos
                .toUpperCase(Locale.ROOT)
                .replaceAll("\\s+", "_");

        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + normalized));
    }

    public Usuario getUsuario() { return usuario; }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return usuario.getPassword(); }
    @Override public String getUsername() { return usuario.getCedula(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
