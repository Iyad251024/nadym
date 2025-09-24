import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  userProfile: any;
  userRoles: string[] = [];
  
  // Mock statistics - in real app, these would come from services
  stats = {
    totalPatients: 1247,
    todayAppointments: 23,
    pendingPrescriptions: 8,
    activeConsultations: 3
  };

  recentActivities = [
    { type: 'appointment', message: 'Rendez-vous avec Marie Dupont à 14h30', time: '2 min' },
    { type: 'prescription', message: 'Nouvelle prescription pour Jean Martin', time: '15 min' },
    { type: 'consultation', message: 'Téléconsultation terminée avec Pierre Durand', time: '1 h' },
    { type: 'message', message: 'Nouveau message de Dr. Leblanc', time: '2 h' }
  ];

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.userProfile = await this.keycloakService.loadUserProfile();
    this.userRoles = this.keycloakService.getUserRoles();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  getUserRole(): string {
    if (this.userRoles.includes('DOCTOR')) return 'Médecin';
    if (this.userRoles.includes('NURSE')) return 'Infirmier(ère)';
    if (this.userRoles.includes('PATIENT')) return 'Patient';
    return 'Utilisateur';
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'appointment': return 'event';
      case 'prescription': return 'receipt';
      case 'consultation': return 'video_call';
      case 'message': return 'message';
      default: return 'info';
    }
  }
}