package com.nadym.teleexpertise.repository;

import com.nadym.teleexpertise.entity.ExpertiseRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpertiseRequestRepository extends JpaRepository<ExpertiseRequest, Long> {

    Page<ExpertiseRequest> findByRequestingDoctorId(Long requestingDoctorId, Pageable pageable);
    
    Page<ExpertiseRequest> findByExpertDoctorId(Long expertDoctorId, Pageable pageable);
    
    Page<ExpertiseRequest> findBySpecialty(String specialty, Pageable pageable);
    
    Page<ExpertiseRequest> findByStatus(ExpertiseRequest.RequestStatus status, Pageable pageable);
    
    @Query("SELECT er FROM ExpertiseRequest er WHERE er.status = :status AND er.deadline <= :deadline")
    List<ExpertiseRequest> findExpiredRequests(@Param("status") ExpertiseRequest.RequestStatus status, 
                                              @Param("deadline") LocalDateTime deadline);
    
    @Query("SELECT COUNT(er) FROM ExpertiseRequest er WHERE er.requestingDoctorId = :doctorId AND er.status = 'COMPLETED'")
    long countCompletedByRequestingDoctorId(@Param("doctorId") Long doctorId);
}