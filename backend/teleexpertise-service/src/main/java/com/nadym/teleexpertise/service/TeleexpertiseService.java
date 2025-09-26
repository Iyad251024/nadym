package com.nadym.teleexpertise.service;

import com.nadym.common.exception.ResourceNotFoundException;
import com.nadym.teleexpertise.entity.ExpertiseRequest;
import com.nadym.teleexpertise.repository.ExpertiseRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TeleexpertiseService {

    @Autowired
    private ExpertiseRequestRepository expertiseRequestRepository;

    public Page<ExpertiseRequest> getRequestsByRequestingDoctor(Long doctorId, Pageable pageable) {
        return expertiseRequestRepository.findByRequestingDoctorId(doctorId, pageable);
    }

    public Page<ExpertiseRequest> getRequestsByExpert(Long expertId, Pageable pageable) {
        return expertiseRequestRepository.findByExpertDoctorId(expertId, pageable);
    }

    public Page<ExpertiseRequest> getRequestsBySpecialty(String specialty, Pageable pageable) {
        return expertiseRequestRepository.findBySpecialty(specialty, pageable);
    }

    public ExpertiseRequest getRequestById(Long id) {
        return expertiseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expertise request not found with id: " + id));
    }

    public ExpertiseRequest createRequest(ExpertiseRequest request) {
        request.setStatus(ExpertiseRequest.RequestStatus.PENDING);
        
        // Set deadline based on urgency
        LocalDateTime deadline = calculateDeadline(request.getUrgency());
        request.setDeadline(deadline);
        
        return expertiseRequestRepository.save(request);
    }

    public ExpertiseRequest assignExpert(Long requestId, Long expertId) {
        ExpertiseRequest request = getRequestById(requestId);
        request.setExpertDoctorId(expertId);
        request.setStatus(ExpertiseRequest.RequestStatus.ASSIGNED);
        request.setAssignedAt(LocalDateTime.now());
        
        return expertiseRequestRepository.save(request);
    }

    public ExpertiseRequest startReview(Long requestId) {
        ExpertiseRequest request = getRequestById(requestId);
        request.setStatus(ExpertiseRequest.RequestStatus.IN_REVIEW);
        
        return expertiseRequestRepository.save(request);
    }

    public ExpertiseRequest completeRequest(Long requestId, String response, String recommendations) {
        ExpertiseRequest request = getRequestById(requestId);
        request.setExpertResponse(response);
        request.setExpertRecommendations(recommendations);
        request.setStatus(ExpertiseRequest.RequestStatus.COMPLETED);
        request.setRespondedAt(LocalDateTime.now());
        
        return expertiseRequestRepository.save(request);
    }

    public ExpertiseRequest cancelRequest(Long requestId, String reason) {
        ExpertiseRequest request = getRequestById(requestId);
        request.setStatus(ExpertiseRequest.RequestStatus.CANCELLED);
        
        return expertiseRequestRepository.save(request);
    }

    public List<ExpertiseRequest> getExpiredRequests() {
        return expertiseRequestRepository.findExpiredRequests(
                ExpertiseRequest.RequestStatus.PENDING, LocalDateTime.now());
    }

    private LocalDateTime calculateDeadline(ExpertiseRequest.UrgencyLevel urgency) {
        LocalDateTime now = LocalDateTime.now();
        return switch (urgency) {
            case URGENT -> now.plusHours(2);
            case HIGH -> now.plusHours(24);
            case MEDIUM -> now.plusDays(3);
            case LOW -> now.plusDays(7);
        };
    }
}