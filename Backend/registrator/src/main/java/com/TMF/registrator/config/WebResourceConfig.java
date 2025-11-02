package com.TMF.registrator.config;

import org.springframework.boot.web.server.MimeMappings;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Sirve todos los recursos del frontend
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0);
    }

    // 👇 Agregamos los tipos MIME faltantes explícitamente
    @Bean
    public ConfigurableServletWebServerFactory webServerFactory() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        MimeMappings mappings = new MimeMappings(MimeMappings.DEFAULT);
        mappings.add("css", "text/css");
        mappings.add("js", "application/javascript");
        mappings.add("svg", "image/svg+xml");
        mappings.add("json", "application/json");
        mappings.add("woff2", "font/woff2");
        factory.setMimeMappings(mappings);
        return factory;
    }
}
