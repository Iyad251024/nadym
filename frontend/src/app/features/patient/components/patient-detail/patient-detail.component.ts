import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../patient-service';
import { Patient } from '../../../../core/models/patient.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  
  patient: Patient | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPatient();
  }

  loadPatient() {
    this.loading = true;
    const id = this.route.snapshot.params['id'];

    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.snackBar.open('Erreur lors du chargement du patient', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  editPatient() {
    this.router.navigate(['/patients', this.patient?.id, 'edit']);
  }

  goBack() {
    this.router.navigate(['/patients']);
  }

  getAge(): number {
    if (!this.patient) return 0;
    const today = new Date();
    const birthDate = new Date(this.patient.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}