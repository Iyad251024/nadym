import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../patient-service';
import { Patient } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {

  patientForm: FormGroup;
  isEditMode = false;
  patientId: string | null = null;
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
    private snackBar: MatSnackBar,
    private patientService: PatientService
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
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      date_of_birth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: [''],
      blood_type: [''],
      insurance_number: [''],
      emergency_contact_name: [''],
      emergency_contact_phone: [''],
      medical_history: [''],
      allergies: ['']
    });
  }

  loadPatient() {
    if (!this.patientId) return;

    this.loading = true;
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        if (patient) {
          this.patientForm.patchValue(patient);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.snackBar.open('Erreur lors du chargement du patient', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.loading = true;
      const formData: Patient = this.patientForm.value;

      if (this.isEditMode && this.patientId) {
        this.patientService.updatePatient(this.patientId, formData).subscribe({
          next: (patient) => {
            this.loading = false;
            if (patient) {
              this.snackBar.open('Patient mis à jour avec succès', 'Fermer', { duration: 3000 });
              this.router.navigate(['/patients']);
            } else {
              this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
            }
          },
          error: (error) => {
            console.error('Error updating patient:', error);
            this.loading = false;
            this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        this.patientService.createPatient(formData).subscribe({
          next: (patient) => {
            this.loading = false;
            if (patient) {
              this.snackBar.open('Patient créé avec succès', 'Fermer', { duration: 3000 });
              this.router.navigate(['/patients']);
            } else {
              this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
            }
          },
          error: (error) => {
            console.error('Error creating patient:', error);
            this.loading = false;
            this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
          }
        });
      }
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