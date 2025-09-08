// src/main/java/com/TMF/registrator/repository/LoginAuditRepository.java
package com.TMF.registrator.repository;

import com.TMF.registrator.model.LoginAudit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginAuditRepository extends JpaRepository<LoginAudit, Long> {}
