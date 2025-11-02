package com.TMF.registrator.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping(value = {
            "/", "/registro-empleado", "/registro-diario", "/control-diario-pendiente",
            "/control-diario-validado", "/validacion-jefe", "/nomina", "/lista-empleados",
            "/crear-frente", "/trabajador-frente"
    })
    public String forwardReactRoutes() {
        // Spring reenvía todas estas rutas a index.html
        return "forward:/index.html";
    }
}
