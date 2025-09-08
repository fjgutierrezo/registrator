/*package com.TMF.registrator.config;

import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("!test") // opcional: evita correr en tests
public class PasswordMigrationRunner implements CommandLineRunner {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;

    public PasswordMigrationRunner(UsuarioRepository usuarioRepo, PasswordEncoder encoder) {
        this.usuarioRepo = usuarioRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        List<Usuario> all = usuarioRepo.findAll();
        int updated = 0;
        for (Usuario u : all) {
            String p = u.getPassword();
            if (p == null || p.isBlank()) continue;
            // si YA está en BCrypt (empieza por $2...), no tocar
            if (p.startsWith("$2a$") || p.startsWith("$2b$") || p.startsWith("$2y$")) continue;
            // migrar a BCrypt
            u.setPassword(encoder.encode(p));
            updated++;
        }
        if (updated > 0) usuarioRepo.saveAll(all);
        System.out.println("🔐 PasswordMigrationRunner: " + updated + " contraseñas migradas a BCrypt.");
    }
}*/
