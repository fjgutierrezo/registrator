package com.TMF.registrator.model;

import jakarta.persistence.*;

@Entity
@Table(name = "adjuntos_jornada")
public class AdjuntoJornada {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long jornadaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegistro tipo; // ENTRADA o SALIDA

    @Column(nullable = false)
    private String nombreArchivo;

    @Column(nullable = false)
    private String mimeType;

    @Column(nullable = false)
    private Long tamanoBytes;

    @Column(nullable = false, length = 1000)
    private String rutaAlmacenamiento;

    public enum TipoRegistro { ENTRADA, SALIDA }

    // Getters/Setters...
    public Long getId() { return id; }

    public Long getJornadaId() { return jornadaId; }
    public void setJornadaId(Long jornadaId) { this.jornadaId = jornadaId; }

    public TipoRegistro getTipo() { return tipo; }
    public void setTipo(TipoRegistro tipo) { this.tipo = tipo; }

    public String getNombreArchivo() { return nombreArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public Long getTamanoBytes() { return tamanoBytes; }
    public void setTamanoBytes(Long tamanoBytes) { this.tamanoBytes = tamanoBytes; }

    public String getRutaAlmacenamiento() { return rutaAlmacenamiento; }
    public void setRutaAlmacenamiento(String rutaAlmacenamiento) { this.rutaAlmacenamiento = rutaAlmacenamiento; }
}
