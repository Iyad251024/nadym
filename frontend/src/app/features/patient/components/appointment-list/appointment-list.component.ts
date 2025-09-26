import { Component, OnInit } from '@angular/core';

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
}

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  
  appointments: Appointment[] = [
    {
      id: 1,
      patientName: 'Marie Dupont',
      doctorName: 'Dr. Jean Martin',
      date: '2024-01-22',
      time: '14:30',
      type: 'Consultation',
      status: 'scheduled',
      reason: 'Suivi médical'
    },
    {
      id: 2,
      patientName: 'Pierre Durand',
      doctorName: 'Dr. Sophie Bernard',
      date: '2024-01-22',
      time: '16:00',
      type: 'Urgence',
      status: 'confirmed',
      reason: 'Douleurs abdominales'
    }
  ];

  loading = false;

  constructor() {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'confirmed': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'scheduled': return 'Programmé';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }
}