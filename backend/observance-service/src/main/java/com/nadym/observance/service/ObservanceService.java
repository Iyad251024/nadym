package com.nadym.observance.service;

import com.nadym.common.exception.ResourceNotFoundException;
import com.nadym.observance.dto.MedicationIntakeDto;
import com.nadym.observance.entity.MedicationIntake;
import com.nadym.observance.repository.MedicationIntakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ObservanceService {

    @Autowired
    private MedicationIntakeRepository medicationIntakeRepository;

    public Page<MedicationIntake> getPatientIntakes(Long patientId, Pageable pageable) {
        return medicationIntakeRepository.findByPatientId(patientId, pageable);
    }

    public MedicationIntake getIntakeById(Long id) {
        return medicationIntakeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication intake not found with id: " + id));
    }

    public MedicationIntake recordIntake(MedicationIntakeDto intakeDto) {
        MedicationIntake intake = convertToEntity(intakeDto);
        intake.setActualTime(LocalDateTime.now());
        intake.setStatus(MedicationIntake.IntakeStatus.TAKEN);
        return medicationIntakeRepository.save(intake);
    }

    public MedicationIntake markAsMissed(Long intakeId) {
        MedicationIntake intake = getIntakeById(intakeId);
        intake.setStatus(MedicationIntake.IntakeStatus.MISSED);
        return medicationIntakeRepository.save(intake);
    }

    public List<MedicationIntake> getPatientIntakesForPeriod(Long patientId, LocalDateTime start, LocalDateTime end) {
        return medicationIntakeRepository.findByPatientIdAndScheduledTimeBetween(patientId, start, end);
    }

    public List<MedicationIntake> getOverdueIntakes() {
        return medicationIntakeRepository.findOverdueIntakes(
                MedicationIntake.IntakeStatus.SCHEDULED, LocalDateTime.now());
    }

    public double calculateAdherenceRate(Long patientId) {
        long taken = medicationIntakeRepository.countTakenByPatientId(patientId);
        long missed = medicationIntakeRepository.countMissedByPatientId(patientId);
        long total = taken + missed;
        
        if (total == 0) return 0.0;
        return (double) taken / total * 100;
    }

    private MedicationIntake convertToEntity(MedicationIntakeDto dto) {
        MedicationIntake intake = new MedicationIntake();
        intake.setPatientId(dto.getPatientId());
        intake.setPrescriptionItemId(dto.getPrescriptionItemId());
        intake.setScheduledTime(dto.getScheduledTime());
        intake.setActualTime(dto.getActualTime());
        intake.setStatus(dto.getStatus());
        intake.setNotes(dto.getNotes());
        intake.setSideEffects(dto.getSideEffects());
        intake.setReminderSent(dto.getReminderSent());
        return intake;
    }
}