import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrescriptionService } from '../../../../core/services/prescription.service';
import { Prescription } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit {

  prescriptions: Prescription[] = [];
  loading = false;

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.loading = true;
    this.prescriptionService.getAllPrescriptions().subscribe({
      next: (prescriptions) => {
        this.prescriptions = prescriptions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading prescriptions:', error);
        this.snackBar.open('Erreur lors du chargement des prescriptions', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  viewPrescription(prescription: Prescription) {
    this.router.navigate(['/patients/prescriptions', prescription.id]);
  }

  deletePrescription(prescription: Prescription) {
    if (!prescription.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette prescription?')) {
      this.prescriptionService.deletePrescription(prescription.id).subscribe({
        next: (success) => {
          if (success) {
            this.snackBar.open('Prescription supprimée', 'Fermer', { duration: 3000 });
            this.loadPrescriptions();
          }
        },
        error: (error) => {
          console.error('Error deleting prescription:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
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