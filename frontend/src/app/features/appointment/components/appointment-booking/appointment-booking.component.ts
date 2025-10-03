import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { PatientService } from '../../../patient/components/patient-service';
import { Patient } from '../../../../core/models/patient.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.scss']
})
export class AppointmentBookingComponent {

  bookingForm: FormGroup;
  patients: Patient[] = [];
  loading = false;

  availableTimes = [
    { value: '08:00', label: '08:00' },
    { value: '08:30', label: '08:30' },
    { value: '09:00', label: '09:00' },
    { value: '09:30', label: '09:30' },
    { value: '10:00', label: '10:00' },
    { value: '10:30', label: '10:30' },
    { value: '11:00', label: '11:00' },
    { value: '11:30', label: '11:30' },
    { value: '12:00', label: '12:00' },
    { value: '12:30', label: '12:30' },
    { value: '13:00', label: '13:00' },
    { value: '13:30', label: '13:30' },
    { value: '14:00', label: '14:00' },
    { value: '14:30', label: '14:30' },
    { value: '15:00', label: '15:00' },
    { value: '15:30', label: '15:30' },
    { value: '16:00', label: '16:00' },
    { value: '16:30', label: '16:30' },
    { value: '17:00', label: '17:00' },
    { value: '17:30', label: '17:30' },
    { value: '18:00', label: '18:00' }
  ];

  availableDurations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 heure' },
    { value: 75, label: '1h 15min' },
    { value: 90, label: '1h 30min' },
    { value: 105, label: '1h 45min' },
    { value: 120, label: '2 heures' }
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AppointmentBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.bookingForm = this.fb.group({
      patient_id: ['', Validators.required],
      appointment_date: ['', Validators.required],
      appointment_time: ['', Validators.required],
      type: ['CONSULTATION', Validators.required],
      reason: [''],
      duration_minutes: [30, [Validators.required, Validators.min(15)]]
    });
  }

  ngOnInit() {
    this.loadPatients();

    // Pre-fill date and time if provided
    if (this.data.selectedDate) {
      const appointmentDate = new Date(this.data.selectedDate);
      this.bookingForm.patchValue({
        appointment_date: appointmentDate,
        appointment_time: '09:00' // Default time for day selection
      });
    } else if (this.data.timeSlot) {
      const appointmentDate = new Date(this.data.timeSlot);
      const timeString = appointmentDate.toTimeString().slice(0, 5);
      this.bookingForm.patchValue({
        appointment_date: appointmentDate,
        appointment_time: timeString
      });
    }
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.loading = true;

      // Combine date and time into a single Date object
      const formValue = this.bookingForm.value;
      const date = formValue.appointment_date;
      const time = formValue.appointment_time;

      const [hours, minutes] = time.split(':');
      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointmentData = {
        patient_id: formValue.patient_id,
        appointment_date: appointmentDateTime.toISOString(),
        type: formValue.type,
        reason: formValue.reason,
        duration_minutes: formValue.duration_minutes,
        doctor_id: 1, // Default doctor ID - you can make this dynamic
        status: 'SCHEDULED' as const
      };

      this.appointmentService.bookAppointment(appointmentData).subscribe({
        next: (appointment) => {
          this.snackBar.open('Rendez-vous créé avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(appointment);
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          this.snackBar.open('Erreur lors de la création du rendez-vous', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : '';
  }
}