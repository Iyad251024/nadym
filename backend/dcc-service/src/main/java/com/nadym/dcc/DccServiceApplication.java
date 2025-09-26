package com.nadym.dcc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = {"com.nadym.dcc", "com.nadym.common"})
@EnableJpaAuditing
public class DccServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DccServiceApplication.class, args);
    }
}