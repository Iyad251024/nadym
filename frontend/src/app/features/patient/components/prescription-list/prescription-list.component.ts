import { Component, OnInit } from '@angular/core';

interface Prescription {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  medications: string[];
  status: 'active' | 'completed' | 'cancelled';
  diagnosis: string;
}

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit {
  
  prescriptions: Prescription[] = [
    {
      id: 1,
      patientName: 'Marie Dupont',
      doctorName: 'Dr. Jean Martin',
      date: '2024-01-20',
      medications: ['Amoxicilline 500mg', 'Paracétamol 1000mg'],
      status: 'active',
      diagnosis: 'Infection respiratoire'
    },
    {
      id: 2,
      patientName: 'Pierre Durand',
      doctorName: 'Dr. Sophie Bernard',
      date: '2024-01-18',
      medications: ['Metformine 500mg', 'Lisinopril 10mg'],
      status: 'active',
      diagnosis: 'Diabète type 2, Hypertension'
    }
  ];

  loading = false;

  constructor() {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'accent';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  }
}