// src/main/java/com/TMF/registrator/config/SecurityConfig.java
package com.TMF.registrator.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                // ✅ Guarda automáticamente el SecurityContext en la sesión
                .securityContext(sc -> sc.requireExplicitSave(false))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/capataz/**").hasAnyRole("CAPATAZ", "JEFE")
                        // ✅ Acepta Jefe_Obra y también Jefe (por si algunos usuarios quedaron con ese rol)
                        .requestMatchers("/api/jefeobra/**").hasAnyRole("JEFE_OBRA", "JEFE")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable());

        return http.build();
    }
}
