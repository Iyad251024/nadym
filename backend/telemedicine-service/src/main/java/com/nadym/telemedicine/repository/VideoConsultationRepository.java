package com.nadym.telemedicine.repository;

import com.nadym.telemedicine.entity.VideoConsultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VideoConsultationRepository extends JpaRepository<VideoConsultation, Long> {

    Page<VideoConsultation> findByDoctorId(Long doctorId, Pageable pageable);
    
    Page<VideoConsultation> findByPatientId(Long patientId, Pageable pageable);
    
    Optional<VideoConsultation> findByRoomId(String roomId);
    
    @Query("SELECT vc FROM VideoConsultation vc WHERE vc.status = :status AND vc.scheduledTime BETWEEN :start AND :end")
    List<VideoConsultation> findByStatusAndScheduledTimeBetween(
            @Param("status") VideoConsultation.ConsultationStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}