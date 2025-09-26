import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface ExpertiseRequest {
  id: number;
  patientName: string;
  patientAge: number;
  specialty: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_review' | 'completed' | 'cancelled';
  requestDate: string;
  responseDate?: string;
  requestingDoctor: string;
  expertName?: string;
  clinicalQuestion: string;
  patientHistory: string;
  currentTreatment?: string;
  examinationFindings: string;
  diagnosticResults?: string;
  expertResponse?: string;
  recommendations?: string;
  additionalNotes?: string;
}

@Component({
  selector: 'app-expertise-response',
  templateUrl: './expertise-response.component.html',
  styleUrls: ['./expertise-response.component.scss']
})
export class ExpertiseResponseComponent implements OnInit {
  
  expertiseRequest: ExpertiseRequest | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExpertiseRequest();
  }

  loadExpertiseRequest() {
    this.loading = true;
    const id = parseInt(this.route.snapshot.params['id']);
    
    // Mock data - in real app, this would come from a service
    this.expertiseRequest = {
      id: id,
      patientName: 'Marie Dupont',
      patientAge: 67,
      specialty: 'Cardiologie',
      urgency: 'high',
      status: 'completed',
      requestDate: '2024-01-18T09:00:00',
      responseDate: '2024-01-19T14:30:00',
      requestingDoctor: 'Dr. Jean Martin',
      expertName: 'Dr. Pierre Cardio',
      clinicalQuestion: 'Évaluation ECG anormal chez patiente de 65 ans avec douleurs thoraciques atypiques. Suspicion de trouble du rythme. Demande avis pour orientation thérapeutique.',
      patientHistory: 'Antécédents d\'hypertension artérielle depuis 10 ans, diabète type 2 depuis 5 ans. Ménopause à 52 ans. Pas d\'antécédents cardiovasculaires familiaux.',
      currentTreatment: 'Metformine 1000mg x2/j, Lisinopril 10mg/j, Atorvastatine 20mg/j',
      examinationFindings: 'TA 145/90 mmHg, FC 85 bpm irrégulier, auscultation cardiaque: souffle systolique 2/6 au foyer mitral, pas d\'œdèmes des membres inférieurs.',
      diagnosticResults: 'ECG: FA paroxystique, QTc 440ms. Echo-Doppler cardiaque: FEVG 55%, IM grade I/IV, pas de trouble de la cinétique segmentaire.',
      expertResponse: 'Après analyse du dossier, il s\'agit effectivement d\'une fibrillation auriculaire paroxystique chez une patiente avec facteurs de risque cardiovasculaires. L\'échocardiographie montre une fonction systolique préservée avec insuffisance mitrale minime.',
      recommendations: '1. Anticoagulation par AOD (Apixaban 5mg x2/j) - Score CHA2DS2-VASc = 4\n2. Contrôle tensionnel optimal (cible <130/80)\n3. Holter ECG 24h dans 3 mois\n4. Consultation cardiologique dans 6 semaines\n5. Éducation patiente sur les signes d\'alerte',
      additionalNotes: 'Patiente bien informée des enjeux. Bonne observance thérapeutique habituelle. Suivi en médecine générale recommandé tous les 3 mois.'
    };
    
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/teleexpertise']);
  }

  printResponse() {
    window.print();
  }

  exportToPdf() {
    // Simulate PDF export
    console.log('Exporting to PDF...');
  }

  getUrgencyColor(urgency: string): string {
    switch (urgency) {
      case 'urgent': return 'warn';
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return 'primary';
    }
  }

  getUrgencyLabel(urgency: string): string {
    switch (urgency) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return urgency;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'accent';
      case 'assigned': return 'primary';
      case 'in_review': return 'primary';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'assigned': return 'Assignée';
      case 'in_review': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
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
}