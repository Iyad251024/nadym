package com.nadym.transcription.controller;

import com.nadym.transcription.entity.Transcription;
import com.nadym.transcription.service.TranscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transcription")
@Tag(name = "AI Transcription", description = "APIs for AI-powered consultation transcription")
public class TranscriptionController {

    @Autowired
    private TranscriptionService transcriptionService;

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get doctor transcriptions")
    @PreAuthorize("hasRole('DOCTOR') and #doctorId == authentication.principal.claims['user_id']")
    public ResponseEntity<Page<Transcription>> getDoctorTranscriptions(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Transcription> transcriptions = transcriptionService.getDoctorTranscriptions(doctorId, pageable);
        return ResponseEntity.ok(transcriptions);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transcription by ID")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Transcription> getTranscriptionById(@PathVariable Long id) {
        Transcription transcription = transcriptionService.getTranscriptionById(id);
        return ResponseEntity.ok(transcription);
    }

    @PostMapping("/create")
    @Operation(summary = "Create new transcription")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Transcription> createTranscription(
            @RequestParam Long consultationId,
            @RequestParam Long doctorId,
            @RequestParam(required = false) Long patientId,
            @RequestParam String audioFileUrl) {
        
        Transcription transcription = transcriptionService.createTranscription(consultationId, doctorId, patientId, audioFileUrl);
        return ResponseEntity.ok(transcription);
    }

    @PutMapping("/{id}/process")
    @Operation(summary = "Process transcription with AI")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Transcription> processTranscription(
            @PathVariable Long id,
            @RequestBody String rawText) {
        
        Transcription transcription = transcriptionService.processTranscription(id, rawText);
        return ResponseEntity.ok(transcription);
    }
}