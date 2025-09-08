// src/main/java/com/TMF/registrator/model/LoginAudit.java
package com.TMF.registrator.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "login_audit")
public class LoginAudit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioId;
    private String email;
    private String cedula;
    private String nombreCompleto;
    private String rol;
    private String ip;
    private String userAgent;

    private OffsetDateTime loggedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public OffsetDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(OffsetDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }
}
