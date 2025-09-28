import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface ExpertiseRequest {
  id: number;
  patientName: string;
  specialty: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_review' | 'completed' | 'cancelled';
  requestDate: string;
  responseDate?: string;
  expertName?: string;
  summary: string;
}

@Component({
  selector: 'app-expertise-request-list',
  templateUrl: './expertise-request-list.component.html',
  styleUrls: ['./expertise-request-list.component.scss']
})
export class ExpertiseRequestListComponent implements OnInit {
  
  expertiseRequests: ExpertiseRequest[] = [
    {
      id: 1,
      patientName: 'Marie Dupont',
      specialty: 'Cardiologie',
      urgency: 'high',
      status: 'completed',
      requestDate: '2024-01-18T09:00:00',
      responseDate: '2024-01-19T14:30:00',
      expertName: 'Dr. Pierre Cardio',
      summary: 'Évaluation ECG anormal chez patiente de 65 ans'
    },
    {
      id: 2,
      patientName: 'Jean Martin',
      specialty: 'Dermatologie',
      urgency: 'medium',
      status: 'in_review',
      requestDate: '2024-01-19T11:30:00',
      expertName: 'Dr. Sophie Dermato',
      summary: 'Lésion cutanée suspecte à évaluer'
    },
    {
      id: 3,
      patientName: 'Claire Moreau',
      specialty: 'Neurologie',
      urgency: 'urgent',
      status: 'assigned',
      requestDate: '2024-01-20T08:15:00',
      expertName: 'Dr. Michel Neuro',
      summary: 'Céphalées persistantes avec signes neurologiques'
    },
    {
      id: 4,
      patientName: 'Pierre Durand',
      specialty: 'Orthopédie',
      urgency: 'low',
      status: 'pending',
      requestDate: '2024-01-20T16:45:00',
      summary: 'Douleur genou persistante post-traumatique'
    }
  ];

  loading = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadExpertiseRequests();
  }

  loadExpertiseRequests() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getPendingRequests(): ExpertiseRequest[] {
    return this.expertiseRequests.filter(r => r.status === 'pending');
  }

  getInProgressRequests(): ExpertiseRequest[] {
    return this.expertiseRequests.filter(r => 
      r.status === 'assigned' || r.status === 'in_review'
    );
  }

  getCompletedRequests(): ExpertiseRequest[] {
    return this.expertiseRequests.filter(r => 
      r.status === 'completed' || r.status === 'cancelled'
    );
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

  newRequest() {
    this.router.navigate(['/teleexpertise/new']);
  }

  viewResponse(request: ExpertiseRequest) {
    this.router.navigate(['/teleexpertise', request.id, 'response']);
  }

  cancelRequest(request: ExpertiseRequest) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette demande d\'expertise ?')) {
      request.status = 'cancelled';
    }
  }

  canCancel(request: ExpertiseRequest): boolean {
    return request.status === 'pending' || request.status === 'assigned';
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