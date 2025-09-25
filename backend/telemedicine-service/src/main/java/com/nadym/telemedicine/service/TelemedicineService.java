package com.nadym.telemedicine.service;

import com.nadym.common.exception.ResourceNotFoundException;
import com.nadym.telemedicine.entity.VideoConsultation;
import com.nadym.telemedicine.repository.VideoConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class TelemedicineService {

    @Autowired
    private VideoConsultationRepository consultationRepository;

    public Page<VideoConsultation> getDoctorConsultations(Long doctorId, Pageable pageable) {
        return consultationRepository.findByDoctorId(doctorId, pageable);
    }

    public Page<VideoConsultation> getPatientConsultations(Long patientId, Pageable pageable) {
        return consultationRepository.findByPatientId(patientId, pageable);
    }

    public VideoConsultation getConsultationById(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation not found with id: " + id));
    }

    public VideoConsultation scheduleConsultation(Long patientId, Long doctorId, LocalDateTime scheduledTime) {
        VideoConsultation consultation = new VideoConsultation();
        consultation.setPatientId(patientId);
        consultation.setDoctorId(doctorId);
        consultation.setScheduledTime(scheduledTime);
        consultation.setRoomId(generateRoomId());
        consultation.setStatus(VideoConsultation.ConsultationStatus.SCHEDULED);
        
        return consultationRepository.save(consultation);
    }

    public VideoConsultation startConsultation(Long consultationId) {
        VideoConsultation consultation = getConsultationById(consultationId);
        consultation.setStartedAt(LocalDateTime.now());
        consultation.setStatus(VideoConsultation.ConsultationStatus.IN_PROGRESS);
        
        return consultationRepository.save(consultation);
    }

    public VideoConsultation endConsultation(Long consultationId, String notes) {
        VideoConsultation consultation = getConsultationById(consultationId);
        consultation.setEndedAt(LocalDateTime.now());
        consultation.setStatus(VideoConsultation.ConsultationStatus.COMPLETED);
        consultation.setConsultationNotes(notes);
        
        if (consultation.getStartedAt() != null) {
            long duration = java.time.Duration.between(consultation.getStartedAt(), consultation.getEndedAt()).toMinutes();
            consultation.setDurationMinutes((int) duration);
        }
        
        return consultationRepository.save(consultation);
    }

    public VideoConsultation cancelConsultation(Long consultationId, String reason) {
        VideoConsultation consultation = getConsultationById(consultationId);
        consultation.setStatus(VideoConsultation.ConsultationStatus.CANCELLED);
        consultation.setTechnicalIssues(reason);
        
        return consultationRepository.save(consultation);
    }

    private String generateRoomId() {
        return "room_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}