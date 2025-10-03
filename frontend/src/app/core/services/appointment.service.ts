import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, of } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Appointment } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private supabase: SupabaseService) {}

  getAllAppointments(): Observable<Appointment[]> {
    return from(
      this.supabase.client
        .from('appointments')
        .select(`
          *,
          patient:patients(*)
        `)
        .order('appointment_date', { ascending: true })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching appointments:', error);
        return of([]);
      })
    );
  }

  getAppointmentById(id: string): Observable<Appointment | null> {
    return from(
      this.supabase.client
        .from('appointments')
        .select(`
          *,
          patient:patients(*)
        `)
        .eq('id', id)
        .maybeSingle()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching appointment:', error);
        return of(null);
      })
    );
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    const now = new Date().toISOString();
    return from(
      this.supabase.client
        .from('appointments')
        .select(`
          *,
          patient:patients(*)
        `)
        .gte('appointment_date', now)
        .in('status', ['SCHEDULED', 'CONFIRMED'])
        .order('appointment_date', { ascending: true })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching upcoming appointments:', error);
        return of([]);
      })
    );
  }

  bookAppointment(appointment: Appointment): Observable<Appointment | null> {
    return from(
      this.supabase.client
        .from('appointments')
        .insert(appointment)
        .select(`
          *,
          patient:patients(*)
        `)
        .maybeSingle()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error booking appointment:', error);
        return of(null);
      })
    );
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment | null> {
    return from(
      this.supabase.client
        .from('appointments')
        .update(appointment)
        .eq('id', id)
        .select(`
          *,
          patient:patients(*)
        `)
        .maybeSingle()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating appointment:', error);
        return of(null);
      })
    );
  }

  cancelAppointment(id: string): Observable<boolean> {
    return this.updateAppointment(id, { status: 'CANCELLED' }).pipe(
      map(appointment => !!appointment)
    );
  }

  deleteAppointment(id: string): Observable<boolean> {
    return from(
      this.supabase.client
        .from('appointments')
        .delete()
        .eq('id', id)
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError(error => {
        console.error('Error deleting appointment:', error);
        return of(false);
      })
    );
  }

  confirmAppointment(id: string): Observable<boolean> {
    return this.updateAppointment(id, { status: 'CONFIRMED' }).pipe(
      map(appointment => !!appointment)
    );
  }

  completeAppointment(id: string): Observable<boolean> {
    return this.updateAppointment(id, { status: 'COMPLETED' }).pipe(
      map(appointment => !!appointment)
    );
  }
}
