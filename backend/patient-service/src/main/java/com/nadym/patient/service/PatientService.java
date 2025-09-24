package com.nadym.patient.service;

import com.nadym.common.exception.ResourceNotFoundException;
import com.nadym.common.exception.ValidationException;
import com.nadym.patient.dto.PatientDto;
import com.nadym.patient.entity.Patient;
import com.nadym.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Page<Patient> getAllPatients(Pageable pageable) {
        return patientRepository.findAll(pageable);
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    public Optional<Patient> getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    public Page<Patient> searchPatients(String searchTerm, Pageable pageable) {
        return patientRepository.findBySearchTerm(searchTerm, pageable);
    }

    public Patient createPatient(PatientDto patientDto) {
        // Check if patient with email already exists
        if (patientDto.getEmail() != null && patientRepository.findByEmail(patientDto.getEmail()).isPresent()) {
            throw new ValidationException("Patient with email " + patientDto.getEmail() + " already exists");
        }

        Patient patient = convertToEntity(patientDto);
        return patientRepository.save(patient);
    }

    public Patient updatePatient(Long id, PatientDto patientDto) {
        Patient existingPatient = getPatientById(id);

        // Check if email is being changed and if new email already exists
        if (patientDto.getEmail() != null && 
            !patientDto.getEmail().equals(existingPatient.getEmail()) &&
            patientRepository.findByEmail(patientDto.getEmail()).isPresent()) {
            throw new ValidationException("Patient with email " + patientDto.getEmail() + " already exists");
        }

        updateEntityFromDto(existingPatient, patientDto);
        return patientRepository.save(existingPatient);
    }

    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }

    public long getTotalPatientsCount() {
        return patientRepository.countAllPatients();
    }

    private Patient convertToEntity(PatientDto dto) {
        Patient patient = new Patient();
        updateEntityFromDto(patient, dto);
        return patient;
    }

    private void updateEntityFromDto(Patient patient, PatientDto dto) {
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhone());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());
        patient.setCity(dto.getCity());
        patient.setPostalCode(dto.getPostalCode());
        patient.setCountry(dto.getCountry());
        patient.setEmergencyContactName(dto.getEmergencyContactName());
        patient.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setAllergies(dto.getAllergies());
        patient.setCurrentMedications(dto.getCurrentMedications());
    }
}