import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis?: string;
}

@Component({
  selector: 'app-expertise-request-form',
  templateUrl: './expertise-request-form.component.html',
  styleUrls: ['./expertise-request-form.component.scss']
})
export class ExpertiseRequestFormComponent implements OnInit {
  
  expertiseForm: FormGroup;
  loading = false;
  
  patients: Patient[] = [
    { id: 1, name: 'Marie Dupont', age: 67, diagnosis: 'Cancer du sein' },
    { id: 2, name: 'Pierre Durand', age: 72, diagnosis: 'Insuffisance cardiaque' },
    { id: 3, name: 'Claire Moreau', age: 58, diagnosis: 'AVC ischémique' }
  ];

  specialties = [
    { value: 'cardiology', label: 'Cardiologie' },
    { value: 'neurology', label: 'Neurologie' },
    { value: 'oncology', label: 'Oncologie' },
    { value: 'dermatology', label: 'Dermatologie' },
    { value: 'orthopedics', label: 'Orthopédie' },
    { value: 'psychiatry', label: 'Psychiatrie' },
    { value: 'radiology', label: 'Radiologie' },
    { value: 'pathology', label: 'Anatomopathologie' }
  ];

  urgencyLevels = [
    { value: 'low', label: 'Faible', description: 'Réponse sous 7 jours' },
    { value: 'medium', label: 'Moyenne', description: 'Réponse sous 3 jours' },
    { value: 'high', label: 'Élevée', description: 'Réponse sous 24h' },
    { value: 'urgent', label: 'Urgente', description: 'Réponse sous 2h' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.expertiseForm = this.createForm();
  }

  ngOnInit() {
    // Set default values
    this.expertiseForm.patchValue({
      urgency: 'medium'
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: ['', [Validators.required]],
      specialty: ['', [Validators.required]],
      urgency: ['', [Validators.required]],
      clinicalQuestion: ['', [Validators.required, Validators.minLength(20)]],
      patientHistory: ['', [Validators.required]],
      currentTreatment: [''],
      examinationFindings: ['', [Validators.required]],
      diagnosticResults: [''],
      additionalNotes: ['']
    });
  }

  onSubmit() {
    if (this.expertiseForm.valid) {
      this.loading = true;
      const formData = this.expertiseForm.value;
      
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        this.snackBar.open('Demande d\'expertise envoyée avec succès', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/teleexpertise']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/teleexpertise']);
  }

  getSelectedPatient(): Patient | undefined {
    const patientId = this.expertiseForm.get('patientId')?.value;
    return this.patients.find(p => p.id === patientId);
  }

  getSelectedSpecialty(): any {
    const specialty = this.expertiseForm.get('specialty')?.value;
    return this.specialties.find(s => s.value === specialty);
  }

  getSelectedUrgency(): any {
    const urgency = this.expertiseForm.get('urgency')?.value;
    return this.urgencyLevels.find(u => u.value === urgency);
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

  private markFormGroupTouched() {
    Object.keys(this.expertiseForm.controls).forEach(key => {
      const control = this.expertiseForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.expertiseForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('minlength')) {
      return 'Description trop courte (minimum 20 caractères)';
    }
    return '';
  }
}