import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, of } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Patient, Appointment, Prescription, PrescriptionItem, PatientStatistics } from '../../../core/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private supabase: SupabaseService) {}

  getAllPatients(): Observable<Patient[]> {
    return from(
      this.supabase.client
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching patients:', error);
        return of([]);
      })
    );
  }

  getPatientById(id: string): Observable<Patient | null> {
    return from(
      this.supabase.client
        .from('patients')
        .select('*')
        .eq('id', id)
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching patient:', error);
        return of(null);
      })
    );
  }

  createPatient(patient: Patient): Observable<Patient | null> {
    return from(
      this.supabase.client
        .from('patients')
        .insert(patient)
        .select()
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating patient:', error);
        return of(null);
      })
    );
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient | null> {
    return from(
      this.supabase.client
        .from('patients')
        .update(patient)
        .eq('id', id)
        .select()
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating patient:', error);
        return of(null);
      })
    );
  }

  deletePatient(id: string): Observable<boolean> {
    return from(
      this.supabase.client
        .from('patients')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError(error => {
        console.error('Error deleting patient:', error);
        return of(false);
      })
    );
  }

  getPatientAppointments(patientId: string): Observable<Appointment[]> {
    return from(
      this.supabase.client
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching appointments:', error);
        return of([]);
      })
    );
  }

  getPatientPrescriptions(patientId: string): Observable<Prescription[]> {
    return from(
      this.supabase.client
        .from('prescriptions')
        .select(`
          *,
          items:prescription_items(*)
        `)
        .eq('patient_id', patientId)
        .order('prescription_date', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching prescriptions:', error);
        return of([]);
      })
    );
  }

  isPatientOwner(patientId: number, username: string): boolean {
    return true;
  }
}