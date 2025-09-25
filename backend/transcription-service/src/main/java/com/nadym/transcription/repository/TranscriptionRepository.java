package com.nadym.transcription.repository;

import com.nadym.transcription.entity.Transcription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TranscriptionRepository extends JpaRepository<Transcription, Long> {

    Page<Transcription> findByDoctorId(Long doctorId, Pageable pageable);
    
    Optional<Transcription> findByConsultationId(Long consultationId);
    
    @Query("SELECT t FROM Transcription t WHERE t.status = :status")
    List<Transcription> findByStatus(@Param("status") Transcription.TranscriptionStatus status);
    
    @Query("SELECT COUNT(t) FROM Transcription t WHERE t.doctorId = :doctorId AND t.status = 'COMPLETED'")
    long countCompletedByDoctorId(@Param("doctorId") Long doctorId);
}