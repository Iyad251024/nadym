import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { PatientService } from '../../features/patient/components/patient-service';
import { AppointmentService } from './appointment.service';
import { PrescriptionService } from './prescription.service';
import { PatientStatistics } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private prescriptionService: PrescriptionService
  ) {}

  getPatientStatistics(): Observable<PatientStatistics> {
    return forkJoin({
      patients: this.patientService.getAllPatients(),
      appointments: this.appointmentService.getAllAppointments(),
      prescriptions: this.prescriptionService.getActivePrescriptions()
    }).pipe(
      map(({ patients, appointments, prescriptions }) => {
        const now = new Date();

        const upcomingAppointments = appointments.filter(apt =>
          new Date(apt.appointment_date) > now &&
          (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED')
        );

        const completedAppointments = appointments.filter(apt =>
          apt.status === 'COMPLETED'
        );

        const cancelledAppointments = appointments.filter(apt =>
          apt.status === 'CANCELLED'
        );

        const appointmentsByType = this.groupByField(appointments, 'type');
        const appointmentsByStatus = this.groupByField(appointments, 'status');

        const recentPatients = patients.slice(0, 5);

        return {
          totalPatients: patients.length,
          totalAppointments: appointments.length,
          upcomingAppointments: upcomingAppointments.length,
          completedAppointments: completedAppointments.length,
          cancelledAppointments: cancelledAppointments.length,
          activePrescriptions: prescriptions.length,
          appointmentsByType,
          appointmentsByStatus,
          recentPatients
        };
      }),
      catchError(error => {
        console.error('Error fetching statistics:', error);
        return of({
          totalPatients: 0,
          totalAppointments: 0,
          upcomingAppointments: 0,
          completedAppointments: 0,
          cancelledAppointments: 0,
          activePrescriptions: 0,
          appointmentsByType: [],
          appointmentsByStatus: [],
          recentPatients: []
        });
      })
    );
  }

  private groupByField(items: any[], field: string): { type: string; count: number }[] {
    const grouped = items.reduce((acc, item) => {
      const key = item[field] || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([type, count]) => ({
      type,
      count: count as number
    }));
  }
}
