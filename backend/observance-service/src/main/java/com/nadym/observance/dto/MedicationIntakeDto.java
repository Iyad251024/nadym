package com.nadym.observance.dto;

import com.nadym.common.dto.BaseDto;
import com.nadym.observance.entity.MedicationIntake;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class MedicationIntakeDto extends BaseDto {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Prescription item ID is required")
    private Long prescriptionItemId;

    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledTime;

    private LocalDateTime actualTime;
    private MedicationIntake.IntakeStatus status;
    private String notes;
    private String sideEffects;
    private Boolean reminderSent;

    // Constructors
    public MedicationIntakeDto() {}

    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getPrescriptionItemId() { return prescriptionItemId; }
    public void setPrescriptionItemId(Long prescriptionItemId) { this.prescriptionItemId = prescriptionItemId; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public LocalDateTime getActualTime() { return actualTime; }
    public void setActualTime(LocalDateTime actualTime) { this.actualTime = actualTime; }

    public MedicationIntake.IntakeStatus getStatus() { return status; }
    public void setStatus(MedicationIntake.IntakeStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }

    public Boolean getReminderSent() { return reminderSent; }
    public void setReminderSent(Boolean reminderSent) { this.reminderSent = reminderSent; }
}