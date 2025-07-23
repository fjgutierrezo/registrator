package com.TMF.registrator.repository;

import com.TMF.registrator.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByCedula(String cedula);
    List<Usuario> findByPrimerNombreAndPrimerApellido(String primerNombre, String primerApellido);



}
