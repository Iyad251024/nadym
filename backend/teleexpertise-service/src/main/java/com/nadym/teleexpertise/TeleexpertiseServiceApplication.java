package com.nadym.teleexpertise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = {"com.nadym.teleexpertise", "com.nadym.common"})
@EnableJpaAuditing
public class TeleexpertiseServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeleexpertiseServiceApplication.class, args);
    }
}