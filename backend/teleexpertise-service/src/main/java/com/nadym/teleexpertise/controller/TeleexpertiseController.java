package com.nadym.teleexpertise.controller;

import com.nadym.teleexpertise.entity.ExpertiseRequest;
import com.nadym.teleexpertise.service.TeleexpertiseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teleexpertise")
@Tag(name = "Teleexpertise", description = "APIs for specialist consultation requests")
public class TeleexpertiseController {

    @Autowired
    private TeleexpertiseService teleexpertiseService;

    @GetMapping("/doctor/{doctorId}/requests")
    @Operation(summary = "Get requests by requesting doctor")
    @PreAuthorize("hasRole('DOCTOR') and #doctorId == authentication.principal.claims['user_id']")
    public ResponseEntity<Page<ExpertiseRequest>> getRequestsByRequestingDoctor(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ExpertiseRequest> requests = teleexpertiseService.getRequestsByRequestingDoctor(doctorId, pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/expert/{expertId}/requests")
    @Operation(summary = "Get requests assigned to expert")
    @PreAuthorize("hasRole('DOCTOR') and #expertId == authentication.principal.claims['user_id']")
    public ResponseEntity<Page<ExpertiseRequest>> getRequestsByExpert(
            @PathVariable Long expertId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ExpertiseRequest> requests = teleexpertiseService.getRequestsByExpert(expertId, pageable);
        return ResponseEntity.ok(requests);
    }

    @PostMapping
    @Operation(summary = "Create expertise request")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ExpertiseRequest> createRequest(@Valid @RequestBody ExpertiseRequest request) {
        ExpertiseRequest createdRequest = teleexpertiseService.createRequest(request);
        return ResponseEntity.ok(createdRequest);
    }

    @PutMapping("/{requestId}/assign/{expertId}")
    @Operation(summary = "Assign expert to request")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ExpertiseRequest> assignExpert(
            @PathVariable Long requestId,
            @PathVariable Long expertId) {
        
        ExpertiseRequest request = teleexpertiseService.assignExpert(requestId, expertId);
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{requestId}/start-review")
    @Operation(summary = "Start reviewing request")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ExpertiseRequest> startReview(@PathVariable Long requestId) {
        ExpertiseRequest request = teleexpertiseService.startReview(requestId);
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{requestId}/complete")
    @Operation(summary = "Complete expertise request")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ExpertiseRequest> completeRequest(
            @PathVariable Long requestId,
            @RequestParam String response,
            @RequestParam(required = false) String recommendations) {
        
        ExpertiseRequest request = teleexpertiseService.completeRequest(requestId, response, recommendations);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/expired")
    @Operation(summary = "Get expired requests")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<ExpertiseRequest>> getExpiredRequests() {
        List<ExpertiseRequest> requests = teleexpertiseService.getExpiredRequests();
        return ResponseEntity.ok(requests);
    }
}