package com.nadym.transcription.service;

import com.nadym.common.exception.ResourceNotFoundException;
import com.nadym.transcription.entity.Transcription;
import com.nadym.transcription.repository.TranscriptionRepository;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;

@Service
@Transactional
public class TranscriptionService {

    @Autowired
    private TranscriptionRepository transcriptionRepository;

    @Value("${openai.api-key}")
    private String openAiApiKey;

    private OpenAiService openAiService;

    public Page<Transcription> getDoctorTranscriptions(Long doctorId, Pageable pageable) {
        return transcriptionRepository.findByDoctorId(doctorId, pageable);
    }

    public Transcription getTranscriptionById(Long id) {
        return transcriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transcription not found with id: " + id));
    }

    public Transcription createTranscription(Long consultationId, Long doctorId, Long patientId, String audioFileUrl) {
        Transcription transcription = new Transcription();
        transcription.setConsultationId(consultationId);
        transcription.setDoctorId(doctorId);
        transcription.setPatientId(patientId);
        transcription.setAudioFileUrl(audioFileUrl);
        transcription.setStatus(Transcription.TranscriptionStatus.PENDING);
        
        return transcriptionRepository.save(transcription);
    }

    public Transcription processTranscription(Long transcriptionId, String rawText) {
        Transcription transcription = getTranscriptionById(transcriptionId);
        
        transcription.setStatus(Transcription.TranscriptionStatus.PROCESSING);
        transcription.setProcessingStartedAt(LocalDateTime.now());
        transcription.setRawTranscription(rawText);
        
        try {
            // Initialize OpenAI service if not already done
            if (openAiService == null && !openAiApiKey.equals("your-api-key-here")) {
                openAiService = new OpenAiService(openAiApiKey);
            }
            
            if (openAiService != null) {
                // Process with OpenAI to structure the medical notes
                String structuredNotes = generateStructuredNotes(rawText);
                String medicalSummary = generateMedicalSummary(rawText);
                String keyFindings = extractKeyFindings(rawText);
                String recommendations = generateRecommendations(rawText);
                
                transcription.setStructuredNotes(structuredNotes);
                transcription.setMedicalSummary(medicalSummary);
                transcription.setKeyFindings(keyFindings);
                transcription.setRecommendations(recommendations);
                transcription.setConfidenceScore(0.85); // Mock confidence score
                transcription.setLanguageDetected("fr"); // French
            } else {
                // Fallback processing without OpenAI
                transcription.setStructuredNotes(rawText);
                transcription.setMedicalSummary("Résumé médical non disponible - clé API OpenAI manquante");
            }
            
            transcription.setStatus(Transcription.TranscriptionStatus.COMPLETED);
            transcription.setProcessingCompletedAt(LocalDateTime.now());
            
        } catch (Exception e) {
            transcription.setStatus(Transcription.TranscriptionStatus.FAILED);
            transcription.setErrorMessage(e.getMessage());
            transcription.setProcessingCompletedAt(LocalDateTime.now());
        }
        
        return transcriptionRepository.save(transcription);
    }

    private String generateStructuredNotes(String rawText) {
        if (openAiService == null) return rawText;
        
        try {
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model("gpt-3.5-turbo")
                    .messages(Arrays.asList(
                            new ChatMessage("system", "Tu es un assistant médical. Structure les notes de consultation suivantes en format médical professionnel avec sections: Motif de consultation, Examen clinique, Diagnostic, Plan de traitement."),
                            new ChatMessage("user", rawText)
                    ))
                    .maxTokens(1000)
                    .build();
            
            return openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            return rawText; // Fallback to raw text
        }
    }

    private String generateMedicalSummary(String rawText) {
        if (openAiService == null) return "Résumé non disponible";
        
        try {
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model("gpt-3.5-turbo")
                    .messages(Arrays.asList(
                            new ChatMessage("system", "Génère un résumé médical concis de cette consultation en français."),
                            new ChatMessage("user", rawText)
                    ))
                    .maxTokens(300)
                    .build();
            
            return openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            return "Résumé non disponible";
        }
    }

    private String extractKeyFindings(String rawText) {
        if (openAiService == null) return "Éléments clés non disponibles";
        
        try {
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model("gpt-3.5-turbo")
                    .messages(Arrays.asList(
                            new ChatMessage("system", "Extrais les éléments cliniques clés et les observations importantes de cette consultation médicale."),
                            new ChatMessage("user", rawText)
                    ))
                    .maxTokens(400)
                    .build();
            
            return openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            return "Éléments clés non disponibles";
        }
    }

    private String generateRecommendations(String rawText) {
        if (openAiService == null) return "Recommandations non disponibles";
        
        try {
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model("gpt-3.5-turbo")
                    .messages(Arrays.asList(
                            new ChatMessage("system", "Génère les recommandations médicales et le plan de suivi basés sur cette consultation."),
                            new ChatMessage("user", rawText)
                    ))
                    .maxTokens(400)
                    .build();
            
            return openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            return "Recommandations non disponibles";
        }
    }
}