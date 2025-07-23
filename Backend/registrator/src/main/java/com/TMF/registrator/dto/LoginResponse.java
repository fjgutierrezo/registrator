package com.TMF.registrator.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String rol;
    private String nombre;
    private String cedula;

    public LoginResponse(boolean success, String message, String rol, String nombre, String cedula) {
        this.success = success;
        this.message = message;
        this.rol = rol;
        this.nombre = nombre;
        this.cedula = cedula;
    }

    // Getters y setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }
}
