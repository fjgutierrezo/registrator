package com.TMF.registrator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.TMF.registrator")
public class RegistratorApplication {

	public static void main(String[] args) {
		SpringApplication.run(RegistratorApplication.class, args);
	}

}
