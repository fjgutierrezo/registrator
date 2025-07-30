package com.TMF.registrator.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // ✅ especifica origen exacto
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // ✅ incluye OPTIONS
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
