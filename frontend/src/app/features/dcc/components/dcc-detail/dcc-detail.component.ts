import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

interface DccPatient {
  id: number;
  patientName: string;
  patientAge: number;
  diagnosis: string;
  stage: string;
  treatmentPhase: 'diagnostic' | 'treatment' | 'surveillance' | 'palliative';
  lastUpdate: string;
  nextAppointment?: string;
  assignedDoctor: string;
  assignedNurse?: string;
  riskLevel: 'low' | 'medium' | 'high';
  completionRate: number;
  status: 'active' | 'completed' | 'suspended';
  medicalHistory: string;
  currentTreatment: string;
  sideEffects?: string;
  notes?: string;
}

@Component({
  selector: 'app-dcc-detail',
  templateUrl: './dcc-detail.component.html',
  styleUrls: ['./dcc-detail.component.scss']
})
export class DccDetailComponent implements OnInit {
  
  patient: DccPatient | null = null;
  loading = false;
  userRoles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.userRoles = this.keycloakService.getUserRoles();
    this.loadPatient();
  }

  loadPatient() {
    this.loading = true;
    const id = this.route.snapshot.params['id'];
    
    // Mock data - in real app, this would come from a service
    this.patient = {
      id: parseInt(id),
      patientName: 'Marie Dupont',
      patientAge: 67,
      diagnosis: 'Cancer du sein',
      stage: 'T2N1M0',
      treatmentPhase: 'treatment',
      lastUpdate: '2024-01-18T14:30:00',
      nextAppointment: '2024-01-25T10:00:00',
      assignedDoctor: 'Dr. Martin',
      assignedNurse: 'Inf. Sophie',
      riskLevel: 'medium',
      completionRate: 75,
      status: 'active',
      medicalHistory: 'Antécédents familiaux de cancer du sein. Ménopause à 52 ans.',
      currentTreatment: 'Chimiothérapie adjuvante - Protocole AC-T',
      sideEffects: 'Fatigue modérée, nausées occasionnelles',
      notes: 'Patiente très coopérative. Bonne tolérance au traitement.'
    };
    
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  editPatient() {
    this.router.navigate(['/dcc', this.patient?.id, 'edit']);
  }

  goBack() {
    this.router.navigate(['/dcc']);
  }

  getTreatmentPhaseLabel(phase: string): string {
    switch (phase) {
      case 'diagnostic': return 'Diagnostic';
      case 'treatment': return 'Traitement';
      case 'surveillance': return 'Surveillance';
      case 'palliative': return 'Palliatif';
      default: return phase;
    }
  }

  getRiskLevelLabel(risk: string): string {
    switch (risk) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      default: return risk;
    }
  }

  getRiskLevelColor(risk: string): string {
    switch (risk) {
      case 'low': return 'primary';
      case 'medium': return 'accent';
      case 'high': return 'warn';
      default: return 'primary';
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
}