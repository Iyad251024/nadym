import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
}

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
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPatient();
  }

  loadPatient() {
    this.loading = true;
    const id = this.route.snapshot.params['id'];
    
    // Mock data - in real app, this would come from a service
    this.patient = {
      id: parseInt(id),
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@email.com',
      phone: '01 23 45 67 89',
      dateOfBirth: '1985-03-15',
      gender: 'FEMALE',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      emergencyContactName: 'Jean Dupont',
      emergencyContactPhone: '01 98 76 54 32',
      medicalHistory: 'Hypertension artérielle, diabète type 2',
      allergies: 'Pénicilline, fruits de mer',
      currentMedications: 'Metformine 500mg, Lisinopril 10mg'
    };
    
    setTimeout(() => {
      this.loading = false;
    }, 1000);
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
    const birthDate = new Date(this.patient.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}