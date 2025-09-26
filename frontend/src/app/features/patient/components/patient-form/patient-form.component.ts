import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  
  patientForm: FormGroup;
  isEditMode = false;
  patientId: number | null = null;
  loading = false;

  genders = [
    { value: 'MALE', label: 'Homme' },
    { value: 'FEMALE', label: 'Femme' },
    { value: 'OTHER', label: 'Autre' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.createForm();
  }

  ngOnInit() {
    this.patientId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.patientId;
    
    if (this.isEditMode) {
      this.loadPatient();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dateOfBirth: ['', [Validators.required]],
      gender: [''],
      address: [''],
      city: [''],
      postalCode: [''],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      medicalHistory: [''],
      allergies: [''],
      currentMedications: ['']
    });
  }

  loadPatient() {
    this.loading = true;
    
    // Mock data - in real app, this would come from a service
    const mockPatient = {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@email.com',
      phone: '01 23 45 67 89',
      dateOfBirth: '1985-03-15',
      gender: 'FEMALE',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      emergencyContactName: 'Jean Dupont',
      emergencyContactPhone: '01 98 76 54 32',
      medicalHistory: 'Hypertension artérielle, diabète type 2',
      allergies: 'Pénicilline, fruits de mer',
      currentMedications: 'Metformine 500mg, Lisinopril 10mg'
    };
    
    setTimeout(() => {
      this.patientForm.patchValue(mockPatient);
      this.loading = false;
    }, 1000);
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.loading = true;
      const formData = this.patientForm.value;
      
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        const message = this.isEditMode ? 'Patient mis à jour avec succès' : 'Patient créé avec succès';
        this.snackBar.open(message, 'Fermer', { duration: 3000 });
        this.router.navigate(['/patients']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/patients']);
  }

  private markFormGroupTouched() {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.patientForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('email')) {
      return 'Email invalide';
    }
    return '';
  }
}