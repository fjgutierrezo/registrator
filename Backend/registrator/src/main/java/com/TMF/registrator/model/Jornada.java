package com.TMF.registrator.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "jornadas",
        uniqueConstraints = @UniqueConstraint(columnNames = {"cedula_trabajador", "fecha"})
)
public class Jornada {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cedula_trabajador", nullable = false)
    private String cedulaTrabajador;

    @Column(name = "nombre_trabajador", nullable = false)
    private String nombreTrabajador = "";

    @Column(name = "frente_trabajo_id", nullable = false)
    private Long frenteTrabajoId;

    @Column(nullable = false)
    private LocalDate fecha;
    // --- Ediciones por Capataz ---
    private java.time.OffsetDateTime horaEntradaEditada; // opcional
    private java.time.OffsetDateTime horaSalidaEditada;  // opcional
    @jakarta.persistence.Column(length = 2000)
    private String motivoEdicionCapataz;                 // obligatorio si edita horas


    // Entrada
    private OffsetDateTime horaEntradaServidor;
    private OffsetDateTime horaEntradaCliente;
    private Double latEntrada;
    private Double lngEntrada;
    private Double accuracyEntrada;
    @Column(length = 2000)
    private String obsEntrada;
    private String ipEntrada;
    private String userAgentEntrada;

    // Salida
    private OffsetDateTime horaSalidaServidor;
    private OffsetDateTime horaSalidaCliente;
    private Double latSalida;
    private Double lngSalida;
    private Double accuracySalida;
    @Column(length = 2000)
    private String obsSalida;
    private String ipSalida;
    private String userAgentSalida;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JornadaEstado estado = JornadaEstado.ACTIVA;

    // Aprobación
    @Enumerated(EnumType.STRING)
    @Column(name = "aprobacion_estado", nullable = false)
    private AprobacionEstado aprobacionEstado = AprobacionEstado.EN_APROBACION;

    private String aprobadoPorCedula;
    private String aprobadoPorNombre;
    private OffsetDateTime aprobadoEn;

    @Column(length = 1000)
    private String rechazoMotivo;

    // ===== Getters & Setters =====
    public Long getId() { return id; }

    public String getCedulaTrabajador() { return cedulaTrabajador; }
    public void setCedulaTrabajador(String cedulaTrabajador) { this.cedulaTrabajador = cedulaTrabajador; }

    public String getNombreTrabajador() { return nombreTrabajador; }
    public void setNombreTrabajador(String nombreTrabajador) { this.nombreTrabajador = nombreTrabajador; }

    public Long getFrenteTrabajoId() { return frenteTrabajoId; }
    public void setFrenteTrabajoId(Long frenteTrabajoId) { this.frenteTrabajoId = frenteTrabajoId; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public OffsetDateTime getHoraEntradaServidor() { return horaEntradaServidor; }
    public void setHoraEntradaServidor(OffsetDateTime horaEntradaServidor) { this.horaEntradaServidor = horaEntradaServidor; }

    public OffsetDateTime getHoraEntradaCliente() { return horaEntradaCliente; }
    public void setHoraEntradaCliente(OffsetDateTime horaEntradaCliente) { this.horaEntradaCliente = horaEntradaCliente; }

    public Double getLatEntrada() { return latEntrada; }
    public void setLatEntrada(Double latEntrada) { this.latEntrada = latEntrada; }

    public Double getLngEntrada() { return lngEntrada; }
    public void setLngEntrada(Double lngEntrada) { this.lngEntrada = lngEntrada; }

    public Double getAccuracyEntrada() { return accuracyEntrada; }
    public void setAccuracyEntrada(Double accuracyEntrada) { this.accuracyEntrada = accuracyEntrada; }

    public String getObsEntrada() { return obsEntrada; }
    public void setObsEntrada(String obsEntrada) { this.obsEntrada = obsEntrada; }

    public String getIpEntrada() { return ipEntrada; }
    public void setIpEntrada(String ipEntrada) { this.ipEntrada = ipEntrada; }

    public String getUserAgentEntrada() { return userAgentEntrada; }
    public void setUserAgentEntrada(String userAgentEntrada) { this.userAgentEntrada = userAgentEntrada; }

    public OffsetDateTime getHoraSalidaServidor() { return horaSalidaServidor; }
    public void setHoraSalidaServidor(OffsetDateTime horaSalidaServidor) { this.horaSalidaServidor = horaSalidaServidor; }

    public OffsetDateTime getHoraSalidaCliente() { return horaSalidaCliente; }
    public void setHoraSalidaCliente(OffsetDateTime horaSalidaCliente) { this.horaSalidaCliente = horaSalidaCliente; }

    public Double getLatSalida() { return latSalida; }
    public void setLatSalida(Double latSalida) { this.latSalida = latSalida; }

    public Double getLngSalida() { return lngSalida; }
    public void setLngSalida(Double lngSalida) { this.lngSalida = lngSalida; }

    public Double getAccuracySalida() { return accuracySalida; }
    public void setAccuracySalida(Double accuracySalida) { this.accuracySalida = accuracySalida; }

    public String getObsSalida() { return obsSalida; }
    public void setObsSalida(String obsSalida) { this.obsSalida = obsSalida; }

    public String getIpSalida() { return ipSalida; }
    public void setIpSalida(String ipSalida) { this.ipSalida = ipSalida; }

    public String getUserAgentSalida() { return userAgentSalida; }
    public void setUserAgentSalida(String userAgentSalida) { this.userAgentSalida = userAgentSalida; }

    public JornadaEstado getEstado() { return estado; }
    public void setEstado(JornadaEstado estado) { this.estado = estado; }

    public AprobacionEstado getAprobacionEstado() { return aprobacionEstado; }
    public void setAprobacionEstado(AprobacionEstado aprobacionEstado) { this.aprobacionEstado = aprobacionEstado; }

    public String getAprobadoPorCedula() { return aprobadoPorCedula; }
    public void setAprobadoPorCedula(String aprobadoPorCedula) { this.aprobadoPorCedula = aprobadoPorCedula; }

    public String getAprobadoPorNombre() { return aprobadoPorNombre; }
    public void setAprobadoPorNombre(String aprobadoPorNombre) { this.aprobadoPorNombre = aprobadoPorNombre; }

    public OffsetDateTime getAprobadoEn() { return aprobadoEn; }
    public void setAprobadoEn(OffsetDateTime aprobadoEn) { this.aprobadoEn = aprobadoEn; }

    public String getRechazoMotivo() { return rechazoMotivo; }
    public void setRechazoMotivo(String rechazoMotivo) { this.rechazoMotivo = rechazoMotivo; }
    public java.time.OffsetDateTime getHoraEntradaEditada() { return horaEntradaEditada; }
    public void setHoraEntradaEditada(java.time.OffsetDateTime horaEntradaEditada) { this.horaEntradaEditada = horaEntradaEditada; }

    public java.time.OffsetDateTime getHoraSalidaEditada() { return horaSalidaEditada; }
    public void setHoraSalidaEditada(java.time.OffsetDateTime horaSalidaEditada) { this.horaSalidaEditada = horaSalidaEditada; }

    public String getMotivoEdicionCapataz() { return motivoEdicionCapataz; }
    public void setMotivoEdicionCapataz(String motivoEdicionCapataz) { this.motivoEdicionCapataz = motivoEdicionCapataz; }

}
