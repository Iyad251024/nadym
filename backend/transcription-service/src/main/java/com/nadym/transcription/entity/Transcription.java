package com.nadym.transcription.entity;

import com.nadym.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "transcriptions")
public class Transcription extends BaseEntity {

    @NotNull(message = "Consultation ID is required")
    @Column(name = "consultation_id", nullable = false)
    private Long consultationId;

    @NotNull(message = "Doctor ID is required")
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "audio_file_url")
    private String audioFileUrl;

    @Column(name = "raw_transcription", columnDefinition = "TEXT")
    private String rawTranscription;

    @Column(name = "structured_notes", columnDefinition = "TEXT")
    private String structuredNotes;

    @Column(name = "medical_summary", columnDefinition = "TEXT")
    private String medicalSummary;

    @Column(name = "key_findings", columnDefinition = "TEXT")
    private String keyFindings;

    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TranscriptionStatus status = TranscriptionStatus.PENDING;

    @Column(name = "processing_started_at")
    private LocalDateTime processingStartedAt;

    @Column(name = "processing_completed_at")
    private LocalDateTime processingCompletedAt;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "language_detected")
    private String languageDetected;

    // Constructors
    public Transcription() {}

    // Getters and Setters
    public Long getConsultationId() { return consultationId; }
    public void setConsultationId(Long consultationId) { this.consultationId = consultationId; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getAudioFileUrl() { return audioFileUrl; }
    public void setAudioFileUrl(String audioFileUrl) { this.audioFileUrl = audioFileUrl; }

    public String getRawTranscription() { return rawTranscription; }
    public void setRawTranscription(String rawTranscription) { this.rawTranscription = rawTranscription; }

    public String getStructuredNotes() { return structuredNotes; }
    public void setStructuredNotes(String structuredNotes) { this.structuredNotes = structuredNotes; }

    public String getMedicalSummary() { return medicalSummary; }
    public void setMedicalSummary(String medicalSummary) { this.medicalSummary = medicalSummary; }

    public String getKeyFindings() { return keyFindings; }
    public void setKeyFindings(String keyFindings) { this.keyFindings = keyFindings; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public TranscriptionStatus getStatus() { return status; }
    public void setStatus(TranscriptionStatus status) { this.status = status; }

    public LocalDateTime getProcessingStartedAt() { return processingStartedAt; }
    public void setProcessingStartedAt(LocalDateTime processingStartedAt) { this.processingStartedAt = processingStartedAt; }

    public LocalDateTime getProcessingCompletedAt() { return processingCompletedAt; }
    public void setProcessingCompletedAt(LocalDateTime processingCompletedAt) { this.processingCompletedAt = processingCompletedAt; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getLanguageDetected() { return languageDetected; }
    public void setLanguageDetected(String languageDetected) { this.languageDetected = languageDetected; }

    public enum TranscriptionStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }
}