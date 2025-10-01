import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, of, forkJoin } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Prescription, PrescriptionItem } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(private supabase: SupabaseService) {}

  getAllPrescriptions(): Observable<Prescription[]> {
    return from(
      this.supabase.client
        .from('prescriptions')
        .select(`
          *,
          items:prescription_items(*),
          patient:patients(*)
        `)
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

  getPrescriptionById(id: string): Observable<Prescription | null> {
    return from(
      this.supabase.client
        .from('prescriptions')
        .select(`
          *,
          items:prescription_items(*),
          patient:patients(*)
        `)
        .eq('id', id)
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching prescription:', error);
        return of(null);
      })
    );
  }

  createPrescription(prescription: Prescription, items: PrescriptionItem[]): Observable<Prescription | null> {
    return from(
      this.supabase.client
        .from('prescriptions')
        .insert(prescription)
        .select()
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        const createdPrescription = response.data;

        if (createdPrescription && items.length > 0) {
          const itemsWithPrescriptionId = items.map(item => ({
            ...item,
            prescription_id: createdPrescription.id
          }));

          return from(
            this.supabase.client
              .from('prescription_items')
              .insert(itemsWithPrescriptionId)
              .select()
          ).pipe(
            map(itemsResponse => {
              if (itemsResponse.error) throw itemsResponse.error;
              return { ...createdPrescription, items: itemsResponse.data };
            })
          );
        }

        return of(createdPrescription);
      }),
      catchError(error => {
        console.error('Error creating prescription:', error);
        return of(null);
      })
    ) as Observable<Prescription | null>;
  }

  updatePrescription(id: string, prescription: Partial<Prescription>): Observable<Prescription | null> {
    return from(
      this.supabase.client
        .from('prescriptions')
        .update(prescription)
        .eq('id', id)
        .select(`
          *,
          items:prescription_items(*),
          patient:patients(*)
        `)
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating prescription:', error);
        return of(null);
      })
    );
  }

  deletePrescription(id: string): Observable<boolean> {
    return from(
      this.supabase.client
        .from('prescriptions')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError(error => {
        console.error('Error deleting prescription:', error);
        return of(false);
      })
    );
  }

  addPrescriptionItem(item: PrescriptionItem): Observable<PrescriptionItem | null> {
    return from(
      this.supabase.client
        .from('prescription_items')
        .insert(item)
        .select()
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error adding prescription item:', error);
        return of(null);
      })
    );
  }

  updatePrescriptionItem(id: string, item: Partial<PrescriptionItem>): Observable<PrescriptionItem | null> {
    return from(
      this.supabase.client
        .from('prescription_items')
        .update(item)
        .eq('id', id)
        .select()
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating prescription item:', error);
        return of(null);
      })
    );
  }

  deletePrescriptionItem(id: string): Observable<boolean> {
    return from(
      this.supabase.client
        .from('prescription_items')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError(error => {
        console.error('Error deleting prescription item:', error);
        return of(false);
      })
    );
  }

  getActivePrescriptions(): Observable<Prescription[]> {
    return from(
      this.supabase.client
        .from('prescriptions')
        .select(`
          *,
          items:prescription_items(*),
          patient:patients(*)
        `)
        .eq('status', 'ACTIVE')
        .order('prescription_date', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching active prescriptions:', error);
        return of([]);
      })
    );
  }
}
