package com.nadym.telemedicine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = {"com.nadym.telemedicine", "com.nadym.common"})
@EnableJpaAuditing
public class TelemedicineServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TelemedicineServiceApplication.class, args);
    }
}