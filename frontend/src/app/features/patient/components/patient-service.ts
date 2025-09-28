import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  
  isPatientOwner(patientId: number, username: string): boolean {
    // Mock implementation - in real app, this would check if the authenticated user
    // is the owner of the patient record
    return true;
  }
}