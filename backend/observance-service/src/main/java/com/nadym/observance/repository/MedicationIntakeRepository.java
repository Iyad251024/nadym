package com.nadym.observance.repository;

import com.nadym.observance.entity.MedicationIntake;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicationIntakeRepository extends JpaRepository<MedicationIntake, Long> {

    Page<MedicationIntake> findByPatientId(Long patientId, Pageable pageable);

    List<MedicationIntake> findByPatientIdAndScheduledTimeBetween(
            Long patientId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT mi FROM MedicationIntake mi WHERE mi.status = :status AND mi.scheduledTime <= :time")
    List<MedicationIntake> findOverdueIntakes(@Param("status") MedicationIntake.IntakeStatus status, 
                                             @Param("time") LocalDateTime time);

    @Query("SELECT COUNT(mi) FROM MedicationIntake mi WHERE mi.patientId = :patientId AND mi.status = 'TAKEN'")
    long countTakenByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT COUNT(mi) FROM MedicationIntake mi WHERE mi.patientId = :patientId AND mi.status = 'MISSED'")
    long countMissedByPatientId(@Param("patientId") Long patientId);
}