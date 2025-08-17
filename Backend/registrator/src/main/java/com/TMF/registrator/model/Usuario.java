package com.TMF.registrator.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;

    private int diaNacimiento;
    private int mesNacimiento;
    private int anioNacimiento;

    private String cedula;
    private String celular;
    private String direccion;
    private String barrio;

    private String arl;
    private String eps;
    private String fondoPensiones;
    private String fondoCesantias;

    private String tallaCamisa;
    private String tallaPantalon;
    private String tallaCalzado;

    private int numeroHijos;
    private String tipoSangre;

    private String banco;
    private String numeroCuenta;
    private String tipoCuenta;

    private String contactoEmergencia;
    private String telefonoContactoEmergencia;

    private String email;
    private String password;
    private String rol;
    public Usuario(String primerNombre, String segundoNombre, String primerApellido, String segundoApellido,
                   int diaNacimiento, int mesNacimiento, int anioNacimiento, String cedula, String celular,
                   String direccion, String barrio, String arl, String eps, String fondoPensiones,
                   String fondoCesantias, String tallaCamisa, String tallaPantalon, String tallaCalzado,
                   int numeroHijos, String tipoSangre, String banco, String numeroCuenta, String tipoCuenta,
                   String contactoEmergencia, String telefonoContactoEmergencia,String rol, String password) {
        this.primerNombre = primerNombre;
        this.segundoNombre = segundoNombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.diaNacimiento = diaNacimiento;
        this.mesNacimiento = mesNacimiento;
        this.anioNacimiento = anioNacimiento;
        this.cedula = cedula;
        this.celular = celular;
        this.direccion = direccion;
        this.barrio = barrio;
        this.arl = arl;
        this.eps = eps;
        this.fondoPensiones = fondoPensiones;
        this.fondoCesantias = fondoCesantias;
        this.tallaCamisa = tallaCamisa;
        this.tallaPantalon = tallaPantalon;
        this.tallaCalzado = tallaCalzado;
        this.numeroHijos = numeroHijos;
        this.tipoSangre = tipoSangre;
        this.banco = banco;
        this.numeroCuenta = numeroCuenta;
        this.tipoCuenta = tipoCuenta;
        this.contactoEmergencia = contactoEmergencia;
        this.telefonoContactoEmergencia = telefonoContactoEmergencia;
        this.rol = rol;
        this.password = password;
    }
    public Usuario() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
    @Transient
    public String getNombreCompleto(){
        String s = String.format("%s %s %s %s",
                ns(getPrimerNombre()), ns(getSegundoNombre()),
                ns(getPrimerApellido()), ns(getSegundoApellido())
        ).replaceAll("\\s+"," ").trim();
        return s.isBlank() ? getCedula() : s;
    }
    private static String ns(String v){ return v==null ? "" : v.trim(); }

}
