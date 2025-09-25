package com.nadym.observance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = {"com.nadym.observance", "com.nadym.common"})
@EnableJpaAuditing
public class ObservanceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ObservanceServiceApplication.class, args);
    }
}