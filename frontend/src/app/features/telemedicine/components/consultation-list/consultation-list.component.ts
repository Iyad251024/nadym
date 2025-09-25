import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

interface Consultation {
  id: number;
  patientName?: string;
  doctorName?: string;
  scheduledTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'chat';
  duration?: number;
  roomId?: string;
}

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.scss']
})
export class ConsultationListComponent implements OnInit {
  
  consultations: Consultation[] = [
    {
      id: 1,
      patientName: 'Marie Dupont',
      doctorName: 'Dr. Jean Martin',
      scheduledTime: '2024-01-20T14:30:00',
      status: 'scheduled',
      type: 'video',
      roomId: 'room_abc123'
    },
    {
      id: 2,
      patientName: 'Pierre Durand',
      doctorName: 'Dr. Sophie Bernard',
      scheduledTime: '2024-01-20T16:00:00',
      status: 'in_progress',
      type: 'video',
      duration: 25,
      roomId: 'room_def456'
    },
    {
      id: 3,
      patientName: 'Claire Moreau',
      doctorName: 'Dr. Jean Martin',
      scheduledTime: '2024-01-19T10:00:00',
      status: 'completed',
      type: 'video',
      duration: 30
    }
  ];

  userRoles: string[] = [];
  loading = false;
  upcomingConsultations: Consultation[] = [];
  activeConsultations: Consultation[] = [];
  pastConsultations: Consultation[] = [];

  constructor(
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.userRoles = this.keycloakService.getUserRoles();
    this.loadConsultations();
    this.categorizeConsultations();
  }

  loadConsultations() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  categorizeConsultations() {
    const now = new Date();
    
    this.upcomingConsultations = this.consultations.filter(c => 
      c.status === 'scheduled' && new Date(c.scheduledTime) > now
    );
    
    this.activeConsultations = this.consultations.filter(c => 
      c.status === 'in_progress'
    );
    
    this.pastConsultations = this.consultations.filter(c => 
      c.status === 'completed' || c.status === 'cancelled'
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'scheduled': return 'Programmée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'video': return 'video_call';
      case 'audio': return 'call';
      case 'chat': return 'chat';
      default: return 'help';
    }
  }

  joinConsultation(consultation: Consultation) {
    if (consultation.status === 'scheduled' || consultation.status === 'in_progress') {
      this.router.navigate(['/telemedicine/call', consultation.id]);
    }
  }

  scheduleConsultation() {
    this.router.navigate(['/telemedicine/schedule']);
  }

  cancelConsultation(consultation: Consultation) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette consultation ?')) {
      consultation.status = 'cancelled';
      this.categorizeConsultations();
    }
  }

  canJoin(consultation: Consultation): boolean {
    return consultation.status === 'scheduled' || consultation.status === 'in_progress';
  }

  canCancel(consultation: Consultation): boolean {
    return consultation.status === 'scheduled';
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