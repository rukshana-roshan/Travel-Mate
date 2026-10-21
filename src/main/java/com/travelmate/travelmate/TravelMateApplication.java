package com.travelmate.travelmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Travel Mate application.
 * Bootstraps the Spring Boot context.
 */
@SpringBootApplication
public class TravelMateApplication {
    public static void main(String[] args) {
        SpringApplication.run(TravelMateApplication.class, args);
    }
}
