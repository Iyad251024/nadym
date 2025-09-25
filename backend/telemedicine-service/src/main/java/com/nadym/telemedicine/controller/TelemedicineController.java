package com.nadym.telemedicine.controller;

import com.nadym.telemedicine.entity.VideoConsultation;
import com.nadym.telemedicine.service.TelemedicineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/telemedicine")
@Tag(name = "Telemedicine", description = "APIs for video consultations and telemedicine")
public class TelemedicineController {

    @Autowired
    private TelemedicineService telemedicineService;

    @GetMapping("/doctor/{doctorId}/consultations")
    @Operation(summary = "Get doctor consultations")
    @PreAuthorize("hasRole('DOCTOR') and #doctorId == authentication.principal.claims['user_id']")
    public ResponseEntity<Page<VideoConsultation>> getDoctorConsultations(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<VideoConsultation> consultations = telemedicineService.getDoctorConsultations(doctorId, pageable);
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/patient/{patientId}/consultations")
    @Operation(summary = "Get patient consultations")
    @PreAuthorize("hasRole('PATIENT') and #patientId == authentication.principal.claims['patient_id']")
    public ResponseEntity<Page<VideoConsultation>> getPatientConsultations(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<VideoConsultation> consultations = telemedicineService.getPatientConsultations(patientId, pageable);
        return ResponseEntity.ok(consultations);
    }

    @PostMapping("/schedule")
    @Operation(summary = "Schedule video consultation")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<VideoConsultation> scheduleConsultation(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime scheduledTime) {
        
        VideoConsultation consultation = telemedicineService.scheduleConsultation(patientId, doctorId, scheduledTime);
        return ResponseEntity.ok(consultation);
    }

    @PutMapping("/{consultationId}/start")
    @Operation(summary = "Start video consultation")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<VideoConsultation> startConsultation(@PathVariable Long consultationId) {
        VideoConsultation consultation = telemedicineService.startConsultation(consultationId);
        return ResponseEntity.ok(consultation);
    }

    @PutMapping("/{consultationId}/end")
    @Operation(summary = "End video consultation")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<VideoConsultation> endConsultation(
            @PathVariable Long consultationId,
            @RequestParam(required = false) String notes) {
        
        VideoConsultation consultation = telemedicineService.endConsultation(consultationId, notes);
        return ResponseEntity.ok(consultation);
    }

    @PutMapping("/{consultationId}/cancel")
    @Operation(summary = "Cancel video consultation")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<VideoConsultation> cancelConsultation(
            @PathVariable Long consultationId,
            @RequestParam(required = false) String reason) {
        
        VideoConsultation consultation = telemedicineService.cancelConsultation(consultationId, reason);
        return ResponseEntity.ok(consultation);
    }
}