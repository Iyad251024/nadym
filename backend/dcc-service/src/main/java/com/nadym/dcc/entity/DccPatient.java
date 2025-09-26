package com.nadym.dcc.entity;

import com.nadym.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dcc_patients")
public class DccPatient extends BaseEntity {

    @NotNull(message = "Patient ID is required")
    @Column(name = "patient_id", nullable = false, unique = true)
    private Long patientId;

    @NotNull(message = "Assigned doctor ID is required")
    @Column(name = "assigned_doctor_id", nullable = false)
    private Long assignedDoctorId;

    @Column(name = "assigned_nurse_id")
    private Long assignedNurseId;

    @NotBlank(message = "Diagnosis is required")
    @Column(name = "diagnosis", nullable = false)
    private String diagnosis;

    @Column(name = "cancer_stage")
    private String cancerStage;

    @Column(name = "histology")
    private String histology;

    @Enumerated(EnumType.STRING)
    @Column(name = "treatment_phase", nullable = false)
    private TreatmentPhase treatmentPhase = TreatmentPhase.DIAGNOSTIC;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel = RiskLevel.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DccStatus status = DccStatus.ACTIVE;

    @Column(name = "diagnosis_date")
    private LocalDate diagnosisDate;

    @Column(name = "treatment_start_date")
    private LocalDate treatmentStartDate;

    @Column(name = "last_consultation_date")
    private LocalDate lastConsultationDate;

    @Column(name = "next_appointment_date")
    private LocalDate nextAppointmentDate;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(name = "current_treatment", columnDefinition = "TEXT")
    private String currentTreatment;

    @Column(name = "treatment_response", columnDefinition = "TEXT")
    private String treatmentResponse;

    @Column(name = "side_effects", columnDefinition = "TEXT")
    private String sideEffects;

    @Column(name = "performance_status")
    private Integer performanceStatus;

    @Column(name = "quality_of_life_score")
    private Integer qualityOfLifeScore;

    @Column(name = "completion_percentage")
    private Integer completionPercentage = 0;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "last_update_date")
    private LocalDateTime lastUpdateDate;

    // Constructors
    public DccPatient() {}

    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getAssignedDoctorId() { return assignedDoctorId; }
    public void setAssignedDoctorId(Long assignedDoctorId) { this.assignedDoctorId = assignedDoctorId; }

    public Long getAssignedNurseId() { return assignedNurseId; }
    public void setAssignedNurseId(Long assignedNurseId) { this.assignedNurseId = assignedNurseId; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getCancerStage() { return cancerStage; }
    public void setCancerStage(String cancerStage) { this.cancerStage = cancerStage; }

    public String getHistology() { return histology; }
    public void setHistology(String histology) { this.histology = histology; }

    public TreatmentPhase getTreatmentPhase() { return treatmentPhase; }
    public void setTreatmentPhase(TreatmentPhase treatmentPhase) { this.treatmentPhase = treatmentPhase; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public DccStatus getStatus() { return status; }
    public void setStatus(DccStatus status) { this.status = status; }

    public LocalDate getDiagnosisDate() { return diagnosisDate; }
    public void setDiagnosisDate(LocalDate diagnosisDate) { this.diagnosisDate = diagnosisDate; }

    public LocalDate getTreatmentStartDate() { return treatmentStartDate; }
    public void setTreatmentStartDate(LocalDate treatmentStartDate) { this.treatmentStartDate = treatmentStartDate; }

    public LocalDate getLastConsultationDate() { return lastConsultationDate; }
    public void setLastConsultationDate(LocalDate lastConsultationDate) { this.lastConsultationDate = lastConsultationDate; }

    public LocalDate getNextAppointmentDate() { return nextAppointmentDate; }
    public void setNextAppointmentDate(LocalDate nextAppointmentDate) { this.nextAppointmentDate = nextAppointmentDate; }

    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }

    public String getCurrentTreatment() { return currentTreatment; }
    public void setCurrentTreatment(String currentTreatment) { this.currentTreatment = currentTreatment; }

    public String getTreatmentResponse() { return treatmentResponse; }
    public void setTreatmentResponse(String treatmentResponse) { this.treatmentResponse = treatmentResponse; }

    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }

    public Integer getPerformanceStatus() { return performanceStatus; }
    public void setPerformanceStatus(Integer performanceStatus) { this.performanceStatus = performanceStatus; }

    public Integer getQualityOfLifeScore() { return qualityOfLifeScore; }
    public void setQualityOfLifeScore(Integer qualityOfLifeScore) { this.qualityOfLifeScore = qualityOfLifeScore; }

    public Integer getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Integer completionPercentage) { this.completionPercentage = completionPercentage; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getLastUpdateDate() { return lastUpdateDate; }
    public void setLastUpdateDate(LocalDateTime lastUpdateDate) { this.lastUpdateDate = lastUpdateDate; }

    public enum TreatmentPhase {
        DIAGNOSTIC, TREATMENT, SURVEILLANCE, PALLIATIVE, COMPLETED
    }

    public enum RiskLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum DccStatus {
        ACTIVE, COMPLETED, SUSPENDED, TRANSFERRED
    }
}