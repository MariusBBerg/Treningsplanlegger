package com.treningsplanlegging.treningsplanlegging;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("file:../../../../.env")
public class TreningsplanleggingApplication {

	public static void main(String[] args) {
		SpringApplication.run(TreningsplanleggingApplication.class, args);
	}

}
