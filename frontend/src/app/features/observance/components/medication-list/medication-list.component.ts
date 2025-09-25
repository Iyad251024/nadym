import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  adherenceRate: number;
  status: 'active' | 'completed' | 'paused';
}

@Component({
  selector: 'app-medication-list',
  templateUrl: './medication-list.component.html',
  styleUrls: ['./medication-list.component.scss']
})
export class MedicationListComponent implements OnInit {
  
  medications: Medication[] = [
    {
      id: 1,
      name: 'Amoxicilline',
      dosage: '500mg',
      frequency: '3 fois par jour',
      startDate: '2024-01-15',
      endDate: '2024-01-25',
      adherenceRate: 95,
      status: 'active'
    },
    {
      id: 2,
      name: 'Paracétamol',
      dosage: '1000mg',
      frequency: 'Au besoin',
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      adherenceRate: 78,
      status: 'active'
    },
    {
      id: 3,
      name: 'Vitamine D',
      dosage: '1000 UI',
      frequency: '1 fois par jour',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      adherenceRate: 88,
      status: 'active'
    }
  ];

  userRoles: string[] = [];
  loading = false;

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit() {
    this.userRoles = this.keycloakService.getUserRoles();
    this.loadMedications();
  }

  loadMedications() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'accent';
      case 'paused': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'paused': return 'En pause';
      default: return status;
    }
  }

  getAdherenceColor(rate: number): string {
    if (rate >= 90) return 'primary';
    if (rate >= 70) return 'accent';
    return 'warn';
  }

  recordIntake(medication: Medication) {
    // Simulate recording intake
    console.log('Recording intake for:', medication.name);
  }

  pauseMedication(medication: Medication) {
    medication.status = 'paused';
  }

  resumeMedication(medication: Medication) {
    medication.status = 'active';
  }
}