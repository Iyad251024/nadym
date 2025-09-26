import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface MedicationIntake {
  id: number;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'scheduled' | 'taken' | 'missed' | 'delayed';
  notes?: string;
  sideEffects?: string;
}

@Component({
  selector: 'app-intake-tracking',
  templateUrl: './intake-tracking.component.html',
  styleUrls: ['./intake-tracking.component.scss']
})
export class IntakeTrackingComponent implements OnInit {
  
  intakeForm: FormGroup;
  todayIntakes: MedicationIntake[] = [
    {
      id: 1,
      medicationName: 'Amoxicilline',
      dosage: '500mg',
      scheduledTime: '08:00',
      status: 'taken',
      actualTime: '08:15',
      notes: 'Pris avec le petit-déjeuner'
    },
    {
      id: 2,
      medicationName: 'Paracétamol',
      dosage: '1000mg',
      scheduledTime: '12:00',
      status: 'scheduled'
    },
    {
      id: 3,
      medicationName: 'Vitamine D',
      dosage: '1000 UI',
      scheduledTime: '20:00',
      status: 'scheduled'
    }
  ];

  loading = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.intakeForm = this.createForm();
  }

  ngOnInit() {
    this.loadTodayIntakes();
  }

  createForm(): FormGroup {
    return this.fb.group({
      medicationId: ['', [Validators.required]],
      actualTime: ['', [Validators.required]],
      notes: [''],
      sideEffects: ['']
    });
  }

  loadTodayIntakes() {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  recordIntake(intake: MedicationIntake) {
    intake.status = 'taken';
    intake.actualTime = new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    this.snackBar.open('Prise enregistrée avec succès', 'Fermer', {
      duration: 3000
    });
  }

  markAsMissed(intake: MedicationIntake) {
    if (confirm('Confirmer que cette prise a été manquée ?')) {
      intake.status = 'missed';
      this.snackBar.open('Prise marquée comme manquée', 'Fermer', {
        duration: 3000
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'taken': return 'primary';
      case 'scheduled': return 'accent';
      case 'missed': return 'warn';
      case 'delayed': return 'warn';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'taken': return 'Prise';
      case 'scheduled': return 'Programmée';
      case 'missed': return 'Manquée';
      case 'delayed': return 'Retardée';
      default: return status;
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'taken': return 'check_circle';
      case 'scheduled': return 'schedule';
      case 'missed': return 'cancel';
      case 'delayed': return 'access_time';
      default: return 'help';
    }
  }

  isOverdue(scheduledTime: string): boolean {
    const now = new Date();
    const scheduled = new Date();
    const [hours, minutes] = scheduledTime.split(':');
    scheduled.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return now > scheduled;
  }
}