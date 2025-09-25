package com.nadym.transcription;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = {"com.nadym.transcription", "com.nadym.common"})
@EnableJpaAuditing
public class TranscriptionServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TranscriptionServiceApplication.class, args);
    }
}