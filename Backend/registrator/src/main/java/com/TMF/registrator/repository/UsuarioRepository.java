package com.TMF.registrator.repository;

import com.TMF.registrator.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByCedula(String cedula);
    List<Usuario> findByPrimerNombreAndPrimerApellido(String primerNombre, String primerApellido);
    List<Usuario> findByRol(String rol);
  //  @Query("SELECT u FROM Usuario u WHERE u.rol = :rol AND u.cedula NOT IN (SELECT t.cedula FROM TrabajadorEnFrente t)")
   // List<Usuario> findTrabajadoresNoAsignados(@Param("rol") String rol);



}

