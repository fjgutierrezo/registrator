// src/main/java/com/TMF/registrator/service/LoginAuditService.java
package com.TMF.registrator.service;

import com.TMF.registrator.model.LoginAudit;
import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.repository.LoginAuditRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
public class LoginAuditService {
    private final LoginAuditRepository repo;

    public LoginAuditService(LoginAuditRepository repo) {
        this.repo = repo;
    }

    public void log(Usuario u, HttpServletRequest req) {
        if (u == null) return;
        LoginAudit a = new LoginAudit();
        a.setUsuarioId(u.getId());
        a.setEmail(u.getEmail());
        a.setCedula(u.getCedula());
        a.setNombreCompleto(nombre(u));
        a.setRol(u.getRol());
        a.setIp(req != null ? req.getRemoteAddr() : null);
        a.setUserAgent(req != null ? req.getHeader("User-Agent") : null);
        a.setLoggedAt(OffsetDateTime.now(ZoneOffset.UTC));
        repo.save(a);
    }

    private static String ns(String s){ return s==null? "": s.trim(); }
    private static String nombre(Usuario u) {
        return ("%s %s %s %s".formatted(
                ns(u.getPrimerNombre()), ns(u.getSegundoNombre()),
                ns(u.getPrimerApellido()), ns(u.getSegundoApellido())
        )).replaceAll("\\s+"," ").trim();
    }
}
