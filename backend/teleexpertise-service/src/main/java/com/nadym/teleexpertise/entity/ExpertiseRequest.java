package com.nadym.teleexpertise.entity;

import com.nadym.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "expertise_requests")
public class ExpertiseRequest extends BaseEntity {

    @NotNull(message = "Patient ID is required")
    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @NotNull(message = "Requesting doctor ID is required")
    @Column(name = "requesting_doctor_id", nullable = false)
    private Long requestingDoctorId;

    @Column(name = "expert_doctor_id")
    private Long expertDoctorId;

    @NotBlank(message = "Specialty is required")
    @Column(name = "specialty", nullable = false)
    private String specialty;

    @NotBlank(message = "Clinical question is required")
    @Column(name = "clinical_question", nullable = false, columnDefinition = "TEXT")
    private String clinicalQuestion;

    @Column(name = "patient_history", columnDefinition = "TEXT")
    private String patientHistory;

    @Column(name = "current_treatment", columnDefinition = "TEXT")
    private String currentTreatment;

    @Column(name = "examination_findings", columnDefinition = "TEXT")
    private String examinationFindings;

    @Column(name = "diagnostic_results", columnDefinition = "TEXT")
    private String diagnosticResults;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency", nullable = false)
    private UrgencyLevel urgency = UrgencyLevel.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "expert_response", columnDefinition = "TEXT")
    private String expertResponse;

    @Column(name = "expert_recommendations", columnDefinition = "TEXT")
    private String expertRecommendations;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    // Constructors
    public ExpertiseRequest() {}

    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getRequestingDoctorId() { return requestingDoctorId; }
    public void setRequestingDoctorId(Long requestingDoctorId) { this.requestingDoctorId = requestingDoctorId; }

    public Long getExpertDoctorId() { return expertDoctorId; }
    public void setExpertDoctorId(Long expertDoctorId) { this.expertDoctorId = expertDoctorId; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getClinicalQuestion() { return clinicalQuestion; }
    public void setClinicalQuestion(String clinicalQuestion) { this.clinicalQuestion = clinicalQuestion; }

    public String getPatientHistory() { return patientHistory; }
    public void setPatientHistory(String patientHistory) { this.patientHistory = patientHistory; }

    public String getCurrentTreatment() { return currentTreatment; }
    public void setCurrentTreatment(String currentTreatment) { this.currentTreatment = currentTreatment; }

    public String getExaminationFindings() { return examinationFindings; }
    public void setExaminationFindings(String examinationFindings) { this.examinationFindings = examinationFindings; }

    public String getDiagnosticResults() { return diagnosticResults; }
    public void setDiagnosticResults(String diagnosticResults) { this.diagnosticResults = diagnosticResults; }

    public UrgencyLevel getUrgency() { return urgency; }
    public void setUrgency(UrgencyLevel urgency) { this.urgency = urgency; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getExpertResponse() { return expertResponse; }
    public void setExpertResponse(String expertResponse) { this.expertResponse = expertResponse; }

    public String getExpertRecommendations() { return expertRecommendations; }
    public void setExpertRecommendations(String expertRecommendations) { this.expertRecommendations = expertRecommendations; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public enum UrgencyLevel {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum RequestStatus {
        PENDING, ASSIGNED, IN_REVIEW, COMPLETED, CANCELLED, EXPIRED
    }
}