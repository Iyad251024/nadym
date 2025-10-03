import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { Appointment } from '../../../../core/models/patient.model';
import { SupabaseService } from '../../../../core/services/supabase.service';
console.log(SupabaseService);


@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {

  appointments: Appointment[] = [];
  loading = false;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.snackBar.open('Erreur lors du chargement des rendez-vous', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  bookAppointment() {
    this.router.navigate(['/patients/appointments/new']);
  }

  confirmAppointment(appointment: Appointment) {
    if (!appointment.id) return;

    this.appointmentService.confirmAppointment(appointment.id).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.snackBar.open('Rendez-vous confirmé', 'Fermer', { duration: 3000 });
          this.loadAppointments();
        }
      },
      error: (error: any) => {
        console.error('Error confirming appointment:', error);
        this.snackBar.open('Erreur lors de la confirmation', 'Fermer', { duration: 3000 });
      }
    });
  }

  cancelAppointment(appointment: Appointment) {
    if (!appointment.id) return;

    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous?')) {
      this.appointmentService.cancelAppointment(appointment.id).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.snackBar.open('Rendez-vous annulé', 'Fermer', { duration: 3000 });
            this.loadAppointments();
          }
        },
        error: (error: any) => {
          console.error('Error canceling appointment:', error);
          this.snackBar.open('Erreur lors de l\'annulation', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  deleteAppointment(appointment: Appointment) {
    if (!appointment.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous?')) {
      this.appointmentService.deleteAppointment(appointment.id).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.snackBar.open('Rendez-vous supprimé', 'Fermer', { duration: 3000 });
            this.loadAppointments();
          }
        },
        error: (error: any) => {
          console.error('Error deleting appointment:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  completeAppointment(appointment: Appointment) {
    if (!appointment.id) return;

    this.appointmentService.completeAppointment(appointment.id).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.snackBar.open('Rendez-vous marqué comme terminé', 'Fermer', { duration: 3000 });
          this.loadAppointments();
        }
      },
      error: (error: any) => {
        console.error('Error completing appointment:', error);
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
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