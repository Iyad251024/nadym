package com.nadym.observance.controller;

import com.nadym.observance.dto.MedicationIntakeDto;
import com.nadym.observance.entity.MedicationIntake;
import com.nadym.observance.service.ObservanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/observance")
@Tag(name = "Medication Observance", description = "APIs for tracking medication adherence")
public class ObservanceController {

    @Autowired
    private ObservanceService observanceService;

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get patient medication intakes")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or (hasRole('PATIENT') and #patientId == authentication.principal.claims['patient_id'])")
    public ResponseEntity<Page<MedicationIntake>> getPatientIntakes(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MedicationIntake> intakes = observanceService.getPatientIntakes(patientId, pageable);
        return ResponseEntity.ok(intakes);
    }

    @PostMapping("/record")
    @Operation(summary = "Record medication intake")
    @PreAuthorize("hasRole('PATIENT') or hasRole('NURSE')")
    public ResponseEntity<MedicationIntake> recordIntake(@Valid @RequestBody MedicationIntakeDto intakeDto) {
        MedicationIntake intake = observanceService.recordIntake(intakeDto);
        return ResponseEntity.ok(intake);
    }

    @PutMapping("/{intakeId}/missed")
    @Operation(summary = "Mark intake as missed")
    @PreAuthorize("hasRole('NURSE') or hasRole('DOCTOR')")
    public ResponseEntity<MedicationIntake> markAsMissed(@PathVariable Long intakeId) {
        MedicationIntake intake = observanceService.markAsMissed(intakeId);
        return ResponseEntity.ok(intake);
    }

    @GetMapping("/patient/{patientId}/period")
    @Operation(summary = "Get patient intakes for specific period")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<MedicationIntake>> getPatientIntakesForPeriod(
            @PathVariable Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        List<MedicationIntake> intakes = observanceService.getPatientIntakesForPeriod(patientId, start, end);
        return ResponseEntity.ok(intakes);
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue medication intakes")
    @PreAuthorize("hasRole('NURSE') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicationIntake>> getOverdueIntakes() {
        List<MedicationIntake> intakes = observanceService.getOverdueIntakes();
        return ResponseEntity.ok(intakes);
    }

    @GetMapping("/patient/{patientId}/adherence")
    @Operation(summary = "Calculate patient adherence rate")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Double> getAdherenceRate(@PathVariable Long patientId) {
        double rate = observanceService.calculateAdherenceRate(patientId);
        return ResponseEntity.ok(rate);
    }
}