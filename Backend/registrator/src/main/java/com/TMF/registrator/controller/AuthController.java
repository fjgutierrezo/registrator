// src/main/java/com/TMF/registrator/controller/AuthController.java
package com.TMF.registrator.controller;

import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.repository.UsuarioRepository;
import com.TMF.registrator.service.auth.AppUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepo, PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // --------- LOGIN: cédula + password ----------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String cedula = req != null && req.getCedula() != null ? req.getCedula().trim() : "";
        String rawPass = req != null && req.getPassword() != null ? req.getPassword() : "";
        if (cedula.isEmpty() || rawPass.isEmpty()) {
            return ResponseEntity.badRequest().body(jsonError("Faltan campos: cedula y password"));
        }

        Optional<Usuario> opt = usuarioRepo.findByCedula(cedula);
        if (opt.isEmpty()) {
            return ResponseEntity.status(401).body(jsonError("Usuario no encontrado"));
        }
        Usuario u = opt.get();

        if (u.getPassword() == null || !passwordEncoder.matches(rawPass, u.getPassword())) {
            return ResponseEntity.status(401).body(jsonError("Credenciales inválidas"));
        }

        // Autenticación manual
        AppUserDetails principal = new AppUserDetails(u);
        var authToken = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authToken);
        var context = org.springframework.security.core.context.SecurityContextHolder.getContext();
        new org.springframework.security.web.context.HttpSessionSecurityContextRepository()
                .saveContext(context, httpRequest, httpResponse);


        // Sesión opcional para front
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", u.getId());
        session.setAttribute("email", ns(u.getEmail()));
        session.setAttribute("cedula", ns(u.getCedula()));
        session.setAttribute("rol", ns(u.getRol()));
        session.setAttribute("nombreCompleto", nombre(u));

        // Respuesta segura (sin Map.of para evitar NPE con nulls)
        Map<String, Object> usuarioJson = new HashMap<>();
        usuarioJson.put("id", u.getId());
        usuarioJson.put("email", ns(u.getEmail()));
        usuarioJson.put("cedula", ns(u.getCedula()));
        usuarioJson.put("rol", ns(u.getRol()));
        usuarioJson.put("nombreCompleto", nombre(u));

        Map<String, Object> bodyOk = new HashMap<>();
        bodyOk.put("message", "Login correcto");
        bodyOk.put("usuario", usuarioJson);

        return ResponseEntity.ok(bodyOk);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AppUserDetails principal)) {
            return ResponseEntity.status(401).body(jsonError("No autenticado"));
        }
        Usuario u = principal.getUsuario();

        Map<String, Object> usuarioJson = new HashMap<>();
        usuarioJson.put("id", u.getId());
        usuarioJson.put("email", ns(u.getEmail()));
        usuarioJson.put("cedula", ns(u.getCedula()));
        usuarioJson.put("rol", ns(u.getRol()));
        usuarioJson.put("nombreCompleto", nombre(u));

        return ResponseEntity.ok(usuarioJson);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
    }

    // --------- DTO ----------
    public static class LoginRequest {
        private String cedula;
        private String password;
        public String getCedula() { return cedula; }
        public void setCedula(String cedula) { this.cedula = cedula; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // --------- Helpers ----------
    private static String ns(String s){ return s==null? "": s.trim(); }
    private static String nombre(Usuario u){
        return (ns(u.getPrimerNombre()) + " " + ns(u.getSegundoNombre()) + " " +
                ns(u.getPrimerApellido()) + " " + ns(u.getSegundoApellido()))
                .replaceAll("\\s+"," ").trim();
    }
    private static Map<String,Object> jsonError(String msg){
        Map<String,Object> m = new HashMap<>();
        m.put("error", msg);
        return m;
    }
    @GetMapping("/who")
    public Map<String,Object> who() {
        var ctx = org.springframework.security.core.context.SecurityContextHolder.getContext();
        var auth = ctx.getAuthentication();
        if (auth == null) return Map.of("auth", "null");
        return Map.of(
                "name", auth.getName(),
                "principalClass", auth.getPrincipal()==null ? "null" : auth.getPrincipal().getClass().getName(),
                "authorities", auth.getAuthorities().stream().map(Object::toString).toList()
        );
    }
}
