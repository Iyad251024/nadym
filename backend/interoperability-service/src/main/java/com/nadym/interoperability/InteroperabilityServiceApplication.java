package com.nadym.interoperability;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = {"com.nadym.interoperability", "com.nadym.common"})
@EnableJpaAuditing
public class InteroperabilityServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InteroperabilityServiceApplication.class, args);
    }
}