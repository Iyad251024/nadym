import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Patient {
  id: number;
  name: string;
  age: number;
  email: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
}

@Component({
  selector: 'app-schedule-consultation',
  templateUrl: './schedule-consultation.component.html',
  styleUrls: ['./schedule-consultation.component.scss']
})
export class ScheduleConsultationComponent implements OnInit {
  
  consultationForm: FormGroup;
  loading = false;
  
  patients: Patient[] = [
    { id: 1, name: 'Marie Dupont', age: 67, email: 'marie.dupont@email.com' },
    { id: 2, name: 'Pierre Durand', age: 72, email: 'pierre.durand@email.com' },
    { id: 3, name: 'Claire Moreau', age: 58, email: 'claire.moreau@email.com' }
  ];

  doctors: Doctor[] = [
    { id: 1, name: 'Dr. Jean Martin', specialty: 'Médecine générale', available: true },
    { id: 2, name: 'Dr. Sophie Bernard', specialty: 'Cardiologie', available: true },
    { id: 3, name: 'Dr. Pierre Cardio', specialty: 'Cardiologie', available: false },
    { id: 4, name: 'Dr. Michel Neuro', specialty: 'Neurologie', available: true }
  ];

  consultationTypes = [
    { value: 'routine', label: 'Consultation de routine' },
    { value: 'follow_up', label: 'Suivi médical' },
    { value: 'urgent', label: 'Consultation urgente' },
    { value: 'specialist', label: 'Consultation spécialisée' }
  ];

  durations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 heure' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.consultationForm = this.createForm();
  }

  ngOnInit() {
    // Set default values
    this.consultationForm.patchValue({
      consultationType: 'routine',
      duration: 30,
      date: this.getTomorrowDate(),
      time: '14:00'
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: ['', [Validators.required]],
      doctorId: ['', [Validators.required]],
      consultationType: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      notes: [''],
      sendReminder: [true],
      recordSession: [false]
    });
  }

  onSubmit() {
    if (this.consultationForm.valid) {
      this.loading = true;
      const formData = this.consultationForm.value;
      
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        this.snackBar.open('Consultation programmée avec succès', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/telemedicine']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/telemedicine']);
  }

  getSelectedPatient(): Patient | undefined {
    const patientId = this.consultationForm.get('patientId')?.value;
    return this.patients.find(p => p.id === patientId);
  }

  getSelectedDoctor(): Doctor | undefined {
    const doctorId = this.consultationForm.get('doctorId')?.value;
    return this.doctors.find(d => d.id === doctorId);
  }

  getAvailableDoctors(): Doctor[] {
    return this.doctors.filter(d => d.available);
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  }

  private markFormGroupTouched() {
    Object.keys(this.consultationForm.controls).forEach(key => {
      const control = this.consultationForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.consultationForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    return '';
  }

  formatDateTime(): string {
    const date = this.consultationForm.get('date')?.value;
    const time = this.consultationForm.get('time')?.value;
    
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toLocaleString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return '';
  }
}