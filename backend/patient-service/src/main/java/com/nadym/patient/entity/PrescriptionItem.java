package com.nadym.patient.entity;

import com.nadym.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "prescription_items")
public class PrescriptionItem extends BaseEntity {

    @NotNull(message = "Prescription is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @NotBlank(message = "Medication name is required")
    @Column(name = "medication_name", nullable = false)
    private String medicationName;

    @Column(name = "medication_code")
    private String medicationCode;

    @NotBlank(message = "Dosage is required")
    @Column(name = "dosage", nullable = false)
    private String dosage;

    @NotBlank(message = "Frequency is required")
    @Column(name = "frequency", nullable = false)
    private String frequency;

    @Positive(message = "Duration must be positive")
    @Column(name = "duration_days")
    private Integer durationDays;

    @Positive(message = "Quantity must be positive")
    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "side_effects", columnDefinition = "TEXT")
    private String sideEffects;

    // Constructors
    public PrescriptionItem() {}

    // Getters and Setters
    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getMedicationCode() { return medicationCode; }
    public void setMedicationCode(String medicationCode) { this.medicationCode = medicationCode; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }
}