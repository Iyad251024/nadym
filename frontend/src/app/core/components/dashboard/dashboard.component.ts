import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { StatisticsService } from '../../services/statistics.service';
import { PatientStatistics } from '../../models/patient.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userProfile: any;
  userRoles: string[] = [];
  statistics: PatientStatistics | null = null;
  loading = true;

  stats = {
    totalPatients: 0,
    todayAppointments: 0,
    pendingPrescriptions: 0,
    activeConsultations: 0
  };

  recentActivities = [
    { type: 'appointment', message: 'Rendez-vous avec Marie Dupont à 14h30', time: '2 min' },
    { type: 'prescription', message: 'Nouvelle prescription pour Jean Martin', time: '15 min' },
    { type: 'consultation', message: 'Téléconsultation terminée avec Pierre Durand', time: '1 h' },
    { type: 'message', message: 'Nouveau message de Dr. Leblanc', time: '2 h' }
  ];

  constructor(
    private keycloakService: KeycloakService,
    private statisticsService: StatisticsService
  ) {}

  async ngOnInit() {
    this.userProfile = await this.keycloakService.loadUserProfile();
    this.userRoles = this.keycloakService.getUserRoles();
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.statisticsService.getPatientStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.stats = {
          totalPatients: stats.totalPatients,
          todayAppointments: stats.upcomingAppointments,
          pendingPrescriptions: stats.activePrescriptions,
          activeConsultations: stats.completedAppointments
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
      }
    });
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