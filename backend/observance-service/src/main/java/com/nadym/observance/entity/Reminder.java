package com.nadym.observance.entity;

import com.nadym.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
public class Reminder extends BaseEntity {

    @NotNull(message = "Patient ID is required")
    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @NotNull(message = "Prescription item ID is required")
    @Column(name = "prescription_item_id", nullable = false)
    private Long prescriptionItemId;

    @NotNull(message = "Reminder time is required")
    @Column(name = "reminder_time", nullable = false)
    private LocalDateTime reminderTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ReminderType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReminderStatus status = ReminderStatus.PENDING;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    // Constructors
    public Reminder() {}

    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getPrescriptionItemId() { return prescriptionItemId; }
    public void setPrescriptionItemId(Long prescriptionItemId) { this.prescriptionItemId = prescriptionItemId; }

    public LocalDateTime getReminderTime() { return reminderTime; }
    public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }

    public ReminderType getType() { return type; }
    public void setType(ReminderType type) { this.type = type; }

    public ReminderStatus getStatus() { return status; }
    public void setStatus(ReminderStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public enum ReminderType {
        MEDICATION_TIME, REFILL_NEEDED, APPOINTMENT_REMINDER, SIDE_EFFECT_CHECK
    }

    public enum ReminderStatus {
        PENDING, SENT, ACKNOWLEDGED, EXPIRED
    }
}