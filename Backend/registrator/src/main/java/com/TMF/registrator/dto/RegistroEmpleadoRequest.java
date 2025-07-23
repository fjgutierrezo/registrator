package com.TMF.registrator.dto;
import jakarta.validation.constraints.*;

public class RegistroEmpleadoRequest {
    @NotBlank
    private String primerNombre;

    private String segundoNombre;

    @NotBlank
    private String primerApellido;

    private String segundoApellido;

    @Min(1) @Max(31)
    private int diaNacimiento;

    @Min(1) @Max(12)
    private int mesNacimiento;

    @Min(1900)
    private int anioNacimiento;

    @NotBlank
    private String cedula;

    @NotBlank
    @Pattern(regexp = "\\d{10}", message = "El número de celular debe tener exactamente 10 dígitos")
    private String celular;

    @NotBlank
    private String direccion;

    @NotBlank
    private String barrio;

    @NotBlank
    private String arl;

    @NotBlank
    private String eps;

    @NotBlank
    private String fondoPensiones;

    @NotBlank
    private String fondoCesantias;

    @NotBlank
    private String tallaCamisa;

    @NotBlank
    private String tallaPantalon;

    @NotBlank
    private String tallaCalzado;

    @Min(0)
    private int numeroHijos;

    @NotBlank
    private String tipoSangre;

    @NotBlank
    private String banco;

    @NotBlank
    private String numeroCuenta;

    @NotBlank
    private String tipoCuenta;

    @NotBlank
    private String contactoEmergencia;

    @NotBlank
    private String telefonoContactoEmergencia;

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String rol;
    public String getPrimerNombre() {
        return primerNombre;
    }

    public void setPrimerNombre(String primerNombre) {
        this.primerNombre = primerNombre;
    }

    public String getSegundoNombre() {
        return segundoNombre;
    }

    public void setSegundoNombre(String segundoNombre) {
        this.segundoNombre = segundoNombre;
    }

    public String getPrimerApellido() {
        return primerApellido;
    }

    public void setPrimerApellido(String primerApellido) {
        this.primerApellido = primerApellido;
    }

    public String getSegundoApellido() {
        return segundoApellido;
    }

    public void setSegundoApellido(String segundoApellido) {
        this.segundoApellido = segundoApellido;
    }

    public int getDiaNacimiento() {
        return diaNacimiento;
    }

    public void setDiaNacimiento(int diaNacimiento) {
        this.diaNacimiento = diaNacimiento;
    }

    public int getMesNacimiento() {
        return mesNacimiento;
    }

    public void setMesNacimiento(int mesNacimiento) {
        this.mesNacimiento = mesNacimiento;
    }

    public int getAnioNacimiento() {
        return anioNacimiento;
    }

    public void setAnioNacimiento(int anioNacimiento) {
        this.anioNacimiento = anioNacimiento;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getBarrio() {
        return barrio;
    }

    public void setBarrio(String barrio) {
        this.barrio = barrio;
    }

    public String getArl() {
        return arl;
    }

    public void setArl(String arl) {
        this.arl = arl;
    }

    public String getEps() {
        return eps;
    }

    public void setEps(String eps) {
        this.eps = eps;
    }

    public String getFondoPensiones() {
        return fondoPensiones;
    }

    public void setFondoPensiones(String fondoPensiones) {
        this.fondoPensiones = fondoPensiones;
    }

    public String getFondoCesantias() {
        return fondoCesantias;
    }

    public void setFondoCesantias(String fondoCesantias) {
        this.fondoCesantias = fondoCesantias;
    }

    public String getTallaCamisa() {
        return tallaCamisa;
    }

    public void setTallaCamisa(String tallaCamisa) {
        this.tallaCamisa = tallaCamisa;
    }

    public String getTallaPantalon() {
        return tallaPantalon;
    }

    public void setTallaPantalon(String tallaPantalon) {
        this.tallaPantalon = tallaPantalon;
    }

    public String getTallaCalzado() {
        return tallaCalzado;
    }

    public void setTallaCalzado(String tallaCalzado) {
        this.tallaCalzado = tallaCalzado;
    }

    public int getNumeroHijos() {
        return numeroHijos;
    }

    public void setNumeroHijos(int numeroHijos) {
        this.numeroHijos = numeroHijos;
    }

    public String getTipoSangre() {
        return tipoSangre;
    }

    public void setTipoSangre(String tipoSangre) {
        this.tipoSangre = tipoSangre;
    }

    public String getBanco() {
        return banco;
    }

    public void setBanco(String banco) {
        this.banco = banco;
    }

    public String getNumeroCuenta() {
        return numeroCuenta;
    }

    public void setNumeroCuenta(String numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }

    public String getTipoCuenta() {
        return tipoCuenta;
    }

    public void setTipoCuenta(String tipoCuenta) {
        this.tipoCuenta = tipoCuenta;
    }

    public String getContactoEmergencia() {
        return contactoEmergencia;
    }

    public void setContactoEmergencia(String contactoEmergencia) {
        this.contactoEmergencia = contactoEmergencia;
    }

    public String getTelefonoContactoEmergencia() {
        return telefonoContactoEmergencia;
    }

    public void setTelefonoContactoEmergencia(String telefonoContactoEmergencia) {
        this.telefonoContactoEmergencia = telefonoContactoEmergencia;
    }

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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
