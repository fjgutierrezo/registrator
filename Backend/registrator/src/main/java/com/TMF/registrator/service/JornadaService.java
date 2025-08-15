package com.TMF.registrator.service;

import com.TMF.registrator.dto.JornadaEntradaRequest;
import com.TMF.registrator.dto.JornadaSalidaRequest;
import com.TMF.registrator.dto.JornadaActivaResponse;
import com.TMF.registrator.model.*;
import com.TMF.registrator.repository.*;
import com.TMF.registrator.util.GeoUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.time.Duration;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

@Service
public class JornadaService {

    private final JornadaRepository jornadaRepo;
    private final FrenteTrabajoRepository frenteRepo;
    private final AdjuntoJornadaRepository adjuntoRepo;

    private final Path storageBase = Paths.get("storage/jornadas");
    private final double ACCURACY_MAX_METROS = 50.0;
    private final Duration DESFASE_MAX_CLIENTE = Duration.ofMinutes(2);

    public JornadaService(JornadaRepository jornadaRepo,
                          FrenteTrabajoRepository frenteRepo,
                          AdjuntoJornadaRepository adjuntoRepo) {
        this.jornadaRepo = jornadaRepo;
        this.frenteRepo = frenteRepo;
        this.adjuntoRepo = adjuntoRepo;
    }

    public JornadaActivaResponse crearEntrada(JornadaEntradaRequest req, String ip, String userAgent) {
        var frente = frenteRepo.findById(req.getFrenteTrabajoId())
                .orElseThrow(() -> new IllegalArgumentException("Frente no existe"));

        if (req.getLat() == null || req.getLng() == null || req.getAccuracy() == null)
            throw new IllegalArgumentException("Se requiere geolocalización");

        if (req.getAccuracy() > ACCURACY_MAX_METROS)
            throw new IllegalArgumentException("Precisión insuficiente (accuracy > " + ACCURACY_MAX_METROS + "m)");

        double dist = GeoUtils.distanceMeters(req.getLat(), req.getLng(), frente.getLatitudCentro(), frente.getLongitudCentro());
        if (dist > frente.getRadioMetros())
            throw new IllegalArgumentException("Fuera de zona del frente");

        OffsetDateTime nowServer = OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime clientTime = parseISO(req.getHoraClienteISO());

        LocalDate hoy = nowServer.atZoneSameInstant(ZoneOffset.UTC).toLocalDate();
        if (jornadaRepo.findByCedulaTrabajadorAndFecha(req.getCedula(), hoy).isPresent()) {
            throw new IllegalStateException("Ya existe una jornada registrada hoy para este trabajador");
        }

        Jornada j = new Jornada();
        j.setCedulaTrabajador(req.getCedula());
        j.setNombreTrabajador(""); // opcional: poblar desde UsuarioService si quieres
        j.setFrenteTrabajoId(req.getFrenteTrabajoId());
        j.setFecha(hoy);
        j.setHoraEntradaServidor(nowServer);
        j.setHoraEntradaCliente(clientTime);
        j.setLatEntrada(req.getLat());
        j.setLngEntrada(req.getLng());
        j.setAccuracyEntrada(req.getAccuracy());
        j.setObsEntrada(req.getObservacion());
        j.setIpEntrada(ip);
        j.setUserAgentEntrada(userAgent);
        j.setEstado(JornadaEstado.ACTIVA);
        j.setAprobacionEstado(AprobacionEstado.EN_APROBACION);

        j = jornadaRepo.save(j);

        JornadaActivaResponse res = new JornadaActivaResponse();
        res.setJornadaId(j.getId());
        res.setHoraEntradaServidor(j.getHoraEntradaServidor());
        res.setHoraEntradaCliente(j.getHoraEntradaCliente());
        res.setFrenteTrabajoId(j.getFrenteTrabajoId());
        return res;
    }

    public void adjuntarArchivos(Long jornadaId, AdjuntoJornada.TipoRegistro tipo, MultipartFile[] files) {
        if (files == null || files.length == 0) return;
        try {
            Files.createDirectories(storageBase);
            for (MultipartFile f : files) {
                String safeName = UUID.randomUUID() + "_" + Path.of(f.getOriginalFilename()).getFileName().toString();
                Path destino = storageBase.resolve(safeName);
                Files.copy(f.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

                AdjuntoJornada a = new AdjuntoJornada();
                a.setJornadaId(jornadaId);
                a.setTipo(tipo);
                a.setNombreArchivo(f.getOriginalFilename());
                a.setMimeType(f.getContentType() == null ? "application/octet-stream" : f.getContentType());
                a.setTamanoBytes(f.getSize());
                a.setRutaAlmacenamiento(destino.toString());
                adjuntoRepo.save(a);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error guardando adjuntos", e);
        }
    }

    public void registrarSalida(Long jornadaId, JornadaSalidaRequest req, String ip, String userAgent) {
        Jornada j = jornadaRepo.findById(jornadaId)
                .orElseThrow(() -> new IllegalArgumentException("Jornada no existe"));

        if (j.getEstado() != JornadaEstado.ACTIVA)
            throw new IllegalStateException("La jornada ya está cerrada");

        var frente = frenteRepo.findById(j.getFrenteTrabajoId())
                .orElseThrow(() -> new IllegalArgumentException("Frente no existe"));

        if (req.getLat() == null || req.getLng() == null || req.getAccuracy() == null)
            throw new IllegalArgumentException("Se requiere geolocalización");

        if (req.getAccuracy() > ACCURACY_MAX_METROS)
            throw new IllegalArgumentException("Precisión insuficiente");

        double dist = GeoUtils.distanceMeters(req.getLat(), req.getLng(), frente.getLatitudCentro(), frente.getLongitudCentro());
        if (dist > frente.getRadioMetros())
            throw new IllegalArgumentException("Fuera de zona del frente");

        OffsetDateTime nowServer = OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime clientTime = parseISO(req.getHoraClienteISO());

        j.setHoraSalidaServidor(nowServer);
        j.setHoraSalidaCliente(clientTime);
        j.setLatSalida(req.getLat());
        j.setLngSalida(req.getLng());
        j.setAccuracySalida(req.getAccuracy());
        j.setObsSalida(req.getObservacion());
        j.setIpSalida(ip);
        j.setUserAgentSalida(userAgent);
        j.setEstado(JornadaEstado.CERRADA);
        // Mantiene EN_APROBACION hasta que un superior cambie a APROBADO/RECHAZADO

        jornadaRepo.save(j);
    }

    public Optional<Jornada> getActiva(String cedula, Long frenteId) {
        LocalDate hoy = LocalDate.now(ZoneOffset.UTC);
        return jornadaRepo.findByCedulaTrabajadorAndFrenteTrabajoIdAndFechaAndEstado(
                cedula, frenteId, hoy, JornadaEstado.ACTIVA
        );
    }

    private OffsetDateTime parseISO(String iso) {
        if (iso == null || iso.isBlank()) return null;
        return OffsetDateTime.parse(iso);
    }
    public Optional<Jornada> getActivaPorCedula(String cedula) {
        LocalDate hoy = LocalDate.now(ZoneOffset.UTC);
        return jornadaRepo.findByCedulaTrabajadorAndFechaAndEstado(
                cedula, hoy, JornadaEstado.ACTIVA
        );
    }
}
