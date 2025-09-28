import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Transcription {
  id: number;
  consultationId: number;
  patientName: string;
  doctorName: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidenceScore: number;
  duration: number;
  languageDetected: string;
  rawTranscription: string;
  structuredNotes: string;
  medicalSummary: string;
  keyFindings: string;
  recommendations: string;
  processingTime: number;
}

@Component({
  selector: 'app-transcription-detail',
  templateUrl: './transcription-detail.component.html',
  styleUrls: ['./transcription-detail.component.scss']
})
export class TranscriptionDetailComponent implements OnInit {
  
  transcription: Transcription | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTranscription();
  }

  loadTranscription() {
    this.loading = true;
    const id = parseInt(this.route.snapshot.params['id']);
    
    // Mock data - in real app, this would come from a service
    this.transcription = {
      id: id,
      consultationId: 101,
      patientName: 'Marie Dupont',
      doctorName: 'Dr. Jean Martin',
      date: '2024-01-20T14:30:00',
      status: 'completed',
      confidenceScore: 95,
      duration: 25,
      languageDetected: 'Français',
      processingTime: 45,
      rawTranscription: `Bonjour Madame Dupont, comment allez-vous aujourd'hui ? 

Bonjour Docteur, je me sens un peu mieux depuis la dernière fois. Les douleurs dans la poitrine ont diminué, mais j'ai encore quelques difficultés à dormir.

D'accord, c'est une bonne nouvelle que les douleurs s'améliorent. Concernant le sommeil, est-ce que c'est lié à l'anxiété ou plutôt à une gêne physique ?

Je pense que c'est plutôt de l'anxiété. Depuis l'annonce du diagnostic, j'ai du mal à me détendre le soir.

Je comprends parfaitement. C'est une réaction tout à fait normale. Nous allons voir comment vous aider. Avez-vous pris vos médicaments régulièrement ?

Oui, je prends tout comme vous me l'avez prescrit. Le matin et le soir.

Parfait. Je vais examiner vos derniers résultats d'analyse. Votre tension artérielle s'est stabilisée, c'est très bien. Pour l'anxiété, nous pourrions envisager un accompagnement psychologique si vous le souhaitez.`,
      
      structuredNotes: `**MOTIF DE CONSULTATION**
Suivi médical post-diagnostic, évaluation de l'évolution des symptômes

**PLAINTES PRINCIPALES**
- Amélioration des douleurs thoraciques
- Troubles du sommeil liés à l'anxiété
- Inquiétudes post-diagnostic

**EXAMEN CLINIQUE**
- État général satisfaisant
- Tension artérielle stabilisée
- Bonne observance thérapeutique

**ÉVALUATION PSYCHOLOGIQUE**
- Anxiété réactionnelle au diagnostic
- Difficultés d'endormissement
- Besoin d'accompagnement psychologique

**PLAN DE TRAITEMENT**
- Poursuite du traitement actuel
- Proposition d'accompagnement psychologique
- Surveillance de la tension artérielle`,

      medicalSummary: `Consultation de suivi chez Mme Dupont, 67 ans. Amélioration notable des douleurs thoraciques depuis la dernière consultation. Bonne observance thérapeutique avec stabilisation de la tension artérielle. Présence d'anxiété réactionnelle au diagnostic avec troubles du sommeil. Proposition d'accompagnement psychologique. Poursuite du traitement en cours avec surveillance régulière.`,

      keyFindings: `• Amélioration des douleurs thoraciques
• Stabilisation de la tension artérielle
• Bonne observance médicamenteuse
• Anxiété réactionnelle au diagnostic
• Troubles du sommeil d'origine anxieuse
• Demande d'accompagnement psychologique`,

      recommendations: `1. Poursuivre le traitement antihypertenseur actuel
2. Orienter vers un psychologue pour accompagnement
3. Techniques de relaxation pour améliorer le sommeil
4. Contrôle tensionnel dans 15 jours
5. Prochaine consultation dans 1 mois
6. Surveillance de l'observance thérapeutique`
    };
    
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/transcription']);
  }

  printTranscription() {
    window.print();
  }

  exportToPdf() {
    // Simulate PDF export
    console.log('Exporting transcription to PDF...');
  }

  cleanRecommendation(text: string): string {
    if (!text) return '';
    return text.replace(/^\d+\.\s*/, '');
  }

  cleanFinding(text: string): string {
    if (!text) return '';
    return text.replace('•', '').trim();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Success feedback would go here
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'processing': return 'accent';
      case 'pending': return 'accent';
      case 'failed': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'processing': return 'En cours';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return status;
    }
  }

  getConfidenceColor(score: number): string {
    if (score >= 90) return 'primary';
    if (score >= 70) return 'accent';
    return 'warn';
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatRecommendations(recommendations: string): string[] {
    return recommendations.split('\n').filter(line => line.trim());
  }

  formatKeyFindings(findings: string): string[] {
    return findings.split('\n').filter(line => line.trim());
  }
}