import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
}

@Component({
  selector: 'app-dcc-list',
  templateUrl: './dcc-list.component.html',
  styleUrls: ['./dcc-list.component.scss']
})
export class DccListComponent implements OnInit {
  
  dccPatients: DccPatient[] = [
    {
      id: 1,
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
      status: 'active'
    },
    {
      id: 2,
      patientName: 'Pierre Durand',
      patientAge: 72,
      diagnosis: 'Cancer colorectal',
      stage: 'T3N2M0',
      treatmentPhase: 'surveillance',
      lastUpdate: '2024-01-20T09:15:00',
      nextAppointment: '2024-02-15T14:00:00',
      assignedDoctor: 'Dr. Bernard',
      riskLevel: 'low',
      completionRate: 90,
      status: 'active'
    },
    {
      id: 3,
      patientName: 'Claire Moreau',
      patientAge: 58,
      diagnosis: 'Cancer du poumon',
      stage: 'T4N3M1',
      treatmentPhase: 'palliative',
      lastUpdate: '2024-01-19T16:45:00',
      nextAppointment: '2024-01-22T11:30:00',
      assignedDoctor: 'Dr. Pneumo',
      assignedNurse: 'Inf. Marie',
      riskLevel: 'high',
      completionRate: 60,
      status: 'active'
    }
  ];

  userRoles: string[] = [];
  loading = false;

  constructor(
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.userRoles = this.keycloakService.getUserRoles();
    this.loadDccPatients();
  }

  loadDccPatients() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getActivePatients(): DccPatient[] {
    return this.dccPatients.filter(p => p.status === 'active');
  }

  getCompletedPatients(): DccPatient[] {
    return this.dccPatients.filter(p => p.status === 'completed');
  }

  getSuspendedPatients(): DccPatient[] {
    return this.dccPatients.filter(p => p.status === 'suspended');
  }

  getHighRiskPatients(): DccPatient[] {
    return this.getActivePatients().filter(p => p.riskLevel === 'high');
  }

  getUpcomingAppointments(): DccPatient[] {
    return this.getActivePatients().filter(p => p.nextAppointment && this.isUpcoming(p.nextAppointment));
  }

  isHighRisk(patient: DccPatient): boolean {
    return patient.riskLevel === 'high';
  }

  hasUpcomingAppointment(patient: DccPatient): boolean {
    return patient.nextAppointment ? this.isUpcoming(patient.nextAppointment) : false;
  }

  getTreatmentPhaseColor(phase: string): string {
    switch (phase) {
      case 'diagnostic': return 'accent';
      case 'treatment': return 'primary';
      case 'surveillance': return 'primary';
      case 'palliative': return 'warn';
      default: return 'primary';
    }
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

  getRiskLevelColor(risk: string): string {
    switch (risk) {
      case 'low': return 'primary';
      case 'medium': return 'accent';
      case 'high': return 'warn';
      default: return 'primary';
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

  getCompletionColor(rate: number): string {
    if (rate >= 80) return 'primary';
    if (rate >= 60) return 'accent';
    return 'warn';
  }

  newDcc() {
    this.router.navigate(['/dcc/new']);
  }

  viewDcc(patient: DccPatient) {
    this.router.navigate(['/dcc', patient.id]);
  }

  editDcc(patient: DccPatient) {
    this.router.navigate(['/dcc', patient.id, 'edit']);
  }

  suspendDcc(patient: DccPatient) {
    if (confirm(`Êtes-vous sûr de vouloir suspendre le DCC de ${patient.patientName} ?`)) {
      patient.status = 'suspended';
    }
  }

  resumeDcc(patient: DccPatient) {
    patient.status = 'active';
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

  formatDate(dateTime: string): string {
    return new Date(dateTime).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  isUpcoming(dateTime: string): boolean {
    const appointmentDate = new Date(dateTime);
    const now = new Date();
    const diffDays = Math.ceil((appointmentDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }
}