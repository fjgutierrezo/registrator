/*package com.TMF.registrator.config;

import com.TMF.registrator.model.Usuario;
import com.TMF.registrator.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;

    public DataInitializer(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostConstruct
    public void init() {
        if (usuarioRepository.count() > 0) return; // No volver a cargar si ya existen datos

        List<Usuario> empleados = List.of(
                new Usuario("Carlos", "Andrés", "Gómez", "López", 12, 5, 1987, "123456789", "3001112233",
                        "Calle 10 #45-23", "La Floresta", "SURA", "Sanitas", "Colfondos", "Porvenir",
                        "M", "32", "42", 2, "O+", "Bancolombia", "100023456789", "Ahorros",
                        "Laura Gómez", "3002233445", "jefe", "pass123",5000000,0,0),

                new Usuario("María", "Fernanda", "Rodríguez", "Pérez", 3, 7, 1992, "100000002", "3012223344",
                        "Carrera 25 #33-10", "El Poblado", "Colpatria", "Nueva EPS", "Protección", "Cesantías Protección",
                        "S", "30", "38", 1, "A+", "Davivienda", "100045678901", "Corriente",
                        "Carlos Rodríguez", "3013344556", "Capataz", "maria123",4000000,0,0),

                new Usuario("Luis", "Alberto", "Martínez", "Ruiz", 25, 12, 1980, "100000003", "3104445566",
                        "Transversal 8 #12-90", "Boston", "Bolívar", "Salud Total", "Porvenir", "Colfondos",
                        "L", "34", "43", 3, "B+", "Banco de Bogotá", "100012345678", "Ahorros",
                        "Ana Ruiz", "3101122334", "rrhh", "luis123",4000000,0,0),

                new Usuario("Andrea", "Paola", "Moreno", "García", 6, 4, 1995, "100000004", "3125556677",
                        "Calle 40 #50-20", "La América", "SURA", "Compensar", "Protección", "Cesantías Porvenir",
                        "S", "28", "37", 0, "AB+", "Nequi", "100056789012", "Ahorros",
                        "Juliana Moreno", "3126655443", "Trabajador", "andrea123",2000000,0,143000),

                new Usuario("Juan", "Camilo", "Hernández", "Suárez", 18, 6, 1989, "100000005", "3136667788",
                        "Carrera 45 #100-32", "Belén", "Colpatria", "Sura", "Colpensiones", "Porvenir",
                        "M", "32", "41", 2, "O-", "Bancolombia", "100078901234", "Corriente",
                        "Felipe Hernández", "3132233445", "Trabajador", "juan123",2000000,0,143000),

                new Usuario("Diana", "Marcela", "López", "Torres", 30, 9, 1990, "100000006", "3147778899",
                        "Diagonal 35 #20-14", "Manrique", "Bolívar", "Famisanar", "Protección", "Cesantías Colpatria",
                        "M", "30", "39", 1, "A-", "Davivienda", "100089012345", "Ahorros",
                        "Claudia Torres", "3144455667", "RRHH", "diana123",4000000,0,0),

                new Usuario("Pedro", "Antonio", "Ríos", "Velásquez", 15, 11, 1985, "100000007", "3158889900",
                        "Av. 80 #75-30", "Robledo", "SURA", "Salud Total", "Colfondos", "Porvenir",
                        "L", "34", "44", 3, "B-", "Banco Caja Social", "100099123456", "Corriente",
                        "Jorge Ríos", "3156677889", "Capataz", "pedro123",4000000,0,0),

                new Usuario("Laura", "Carolina", "Quintero", "Ramos", 27, 8, 1996, "100000008", "3169990011",
                        "Calle 60 #12-15", "Buenos Aires", "Colpatria", "Sanitas", "Protección", "Cesantías Porvenir",
                        "S", "28", "36", 0, "AB-", "Nequi", "100011122233", "Ahorros",
                        "Nicolás Quintero", "3163344556", "Trabajador", "laura123",2000000,0,143000),

                new Usuario("Andrés", "Felipe", "Salazar", "Mejía", 9, 1, 1984, "100000009", "3170001122",
                        "Carrera 7 #20-11", "Envigado Centro", "SURA", "Nueva EPS", "Colpensiones", "Colfondos",
                        "XL", "36", "45", 2, "O+", "Banco de Occidente", "100022334455", "Corriente",
                        "María Mejía", "3171122334", "Residente de Obra", "andres123",5000000,0,0),

                new Usuario("Natalia", "Andrea", "Pineda", "Zuluaga", 14, 10, 1993, "100000010", "3181112233",
                        "Diagonal 55 #30-60", "San Javier", "Bolívar", "Compensar", "Porvenir", "Colpatria",
                        "M", "30", "38", 1, "A+", "Davivienda", "100033344455", "Ahorros",
                        "Daniel Zuluaga", "3182233445", "Recursos Humanos", "natalia123",4000000,0,0)
        );

        usuarioRepository.saveAll(empleados);
        System.out.println("✅ Se cargaron 10 empleados automáticamente.");
    }
}
*/