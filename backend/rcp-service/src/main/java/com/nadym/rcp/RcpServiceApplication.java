package com.nadym.rcp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = {"com.nadym.rcp", "com.nadym.common"})
@EnableJpaAuditing
public class RcpServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RcpServiceApplication.class, args);
    }
}