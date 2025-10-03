import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { PatientService } from '../../../patient/components/patient-service';
import { Appointment, Patient } from '../../../../core/models/patient.model';
import { AppointmentBookingComponent } from '../appointment-booking/appointment-booking.component';

@Component({
  selector: 'app-appointment-dashboard',
  templateUrl: './appointment-dashboard.component.html',
  styleUrls: ['./appointment-dashboard.component.scss']
})
export class AppointmentDashboardComponent implements OnInit {

  displayedColumns: string[] = ['patient_name', 'appointment_date', 'status', 'type', 'actions'];
  dataSource = new MatTableDataSource<Appointment>();
  loading = false;
  patients: Patient[] = [];
  appointments: Appointment[] = [];
  timeSlots: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  currentView: 'day' | 'week' | 'month' = 'day';
  currentDate: Date = new Date();
  currentMonth: Date = new Date();
  weekDays: { date: Date; appointments: Appointment[] }[] = [];
  monthDays: { date: Date; isCurrentMonth: boolean; appointments: Appointment[] }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.generateTimeSlots();
    this.loadAppointments();
    this.loadPatients();
    this.updateWeekView();
    this.updateMonthView();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.dataSource.data = appointments;
        this.updateWeekView();
        this.updateMonthView();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.snackBar.open('Erreur lors du chargement des rendez-vous', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Patient inconnu';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'blue';
      case 'CONFIRMED': return 'green';
      case 'IN_PROGRESS': return 'orange';
      case 'COMPLETED': return 'gray';
      case 'CANCELLED': return 'red';
      case 'NO_SHOW': return 'purple';
      default: return 'black';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'Programmé';
      case 'CONFIRMED': return 'Confirmé';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELLED': return 'Annulé';
      case 'NO_SHOW': return 'Absent';
      default: return status;
    }
  }

  confirmAppointment(appointment: Appointment) {
    this.appointmentService.confirmAppointment(appointment.id!).subscribe({
      next: (success) => {
        if (success) {
          this.snackBar.open('Rendez-vous confirmé', 'Fermer', { duration: 3000 });
          this.loadAppointments();
        }
      },
      error: (error) => {
        console.error('Error confirming appointment:', error);
        this.snackBar.open('Erreur lors de la confirmation', 'Fermer', { duration: 3000 });
      }
    });
  }

  cancelAppointment(appointment: Appointment) {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.appointmentService.cancelAppointment(appointment.id!).subscribe({
        next: (success) => {
          if (success) {
            this.snackBar.open('Rendez-vous annulé', 'Fermer', { duration: 3000 });
            this.loadAppointments();
          }
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          this.snackBar.open('Erreur lors de l\'annulation', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  deleteAppointment(appointment: Appointment) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      this.appointmentService.deleteAppointment(appointment.id!).subscribe({
        next: (success) => {
          if (success) {
            this.snackBar.open('Rendez-vous supprimé', 'Fermer', { duration: 3000 });
            this.loadAppointments();
          }
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  generateTimeSlots() {
    this.timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        this.timeSlots.push(time);
      }
    }
  }

  hasAppointmentAt(timeSlot: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.appointments.some(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      const appointmentDay = new Date(appointmentDate);
      appointmentDay.setHours(0, 0, 0, 0);

      if (appointmentDay.getTime() !== today.getTime()) return false;

      const appointmentTime = appointmentDate.toTimeString().slice(0, 5);
      return appointmentTime === timeSlot;
    });
  }

  getAppointmentAt(timeSlot: string): Appointment | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.appointments.find(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      const appointmentDay = new Date(appointmentDate);
      appointmentDay.setHours(0, 0, 0, 0);

      if (appointmentDay.getTime() !== today.getTime()) return false;

      const appointmentTime = appointmentDate.toTimeString().slice(0, 5);
      return appointmentTime === timeSlot;
    }) || null;
  }

  editAppointment(appointment: Appointment) {
    // For now, just show a snackbar. Could open edit dialog later
    this.snackBar.open(`Modifier le rendez-vous de ${this.getPatientName(appointment.patient_id)}`, 'Fermer', {
      duration: 3000
    });
  }

  bookAppointmentAt(timeSlot: string) {
    const today = new Date();
    const [hours, minutes] = timeSlot.split(':');
    const appointmentDate = new Date(today);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const dialogRef = this.dialog.open(AppointmentBookingComponent, {
      width: '600px',
      data: { timeSlot: appointmentDate.toISOString() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  bookAppointment() {
    const dialogRef = this.dialog.open(AppointmentBookingComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  onViewChange(event: any) {
    this.currentView = event.value;
    if (this.currentView === 'week') {
      this.updateWeekView();
    } else if (this.currentView === 'month') {
      this.updateMonthView();
    }
  }

  updateWeekView() {
    this.weekDays = [];
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        date: day,
        appointments: this.getAppointmentsForDay(day)
      });
    }
  }

  updateMonthView() {
    this.monthDays = [];
    const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    // Add days from previous month to fill the first week
    const startDate = new Date(startOfMonth);
    startDate.setDate(startOfMonth.getDate() - startOfMonth.getDay());

    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);

      this.monthDays.push({
        date: day,
        isCurrentMonth: day.getMonth() === this.currentMonth.getMonth(),
        appointments: this.getAppointmentsForDay(day)
      });
    }
  }

  getAppointmentsForDay(date: Date): Appointment[] {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      const appointmentDay = new Date(appointmentDate);
      appointmentDay.setHours(0, 0, 0, 0);
      return appointmentDay.getTime() === targetDate.getTime();
    });
  }

  getWeekRange(): string {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateWeekView();
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateWeekView();
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.updateMonthView();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.updateMonthView();
  }

  changeAppointmentStatus(appointment: Appointment, newStatus: string) {
    this.appointmentService.updateAppointment(appointment.id!, { status: newStatus as any }).subscribe({
      next: (updatedAppointment) => {
        if (updatedAppointment) {
          this.snackBar.open('Statut mis à jour', 'Fermer', { duration: 3000 });
          this.loadAppointments();
        }
      },
      error: (error) => {
        console.error('Error updating appointment status:', error);
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000 });
      }
    });
  }

  isCurrentDay(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  getAppointmentAtForDay(timeSlot: string, date: Date): Appointment | null {
    const targetDate = new Date(date);
    const [hours, minutes] = timeSlot.split(':');
    targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return this.appointments.find(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      return appointmentDate.getTime() === targetDate.getTime();
    }) || null;
  }

  hasAppointmentAtForDay(timeSlot: string, date: Date): boolean {
    return this.getAppointmentAtForDay(timeSlot, date) !== null;
  }

  bookAppointmentAtForDay(timeSlot: string, selectedDate: Date) {
    const dialogRef = this.dialog.open(AppointmentBookingComponent, {
      width: '600px',
      data: { selectedDate: selectedDate.toISOString(), timeSlot: timeSlot }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  bookAppointmentForDay(selectedDate: Date) {
    const dialogRef = this.dialog.open(AppointmentBookingComponent, {
      width: '600px',
      data: { selectedDate: selectedDate.toISOString() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }
}