package com.TMF.registrator.config;

import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CookieConfig {

    @Bean
    public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
        // ⚙️ Permite que el navegador envíe la cookie JSESSIONID entre dominios
        return CookieSameSiteSupplier.ofNone();
    }
}
