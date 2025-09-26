import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
}

@Component({
  selector: 'app-rcp-form',
  templateUrl: './rcp-form.component.html',
  styleUrls: ['./rcp-form.component.scss']
})
export class RcpFormComponent implements OnInit {
  
  rcpForm: FormGroup;
  isEditMode = false;
  meetingId: number | null = null;
  loading = false;

  patients: Patient[] = [
    { id: 1, name: 'Marie Dupont', age: 67, diagnosis: 'Cancer du sein métastatique' },
    { id: 2, name: 'Pierre Durand', age: 72, diagnosis: 'Insuffisance cardiaque sévère' },
    { id: 3, name: 'Claire Moreau', age: 58, diagnosis: 'AVC ischémique étendu' }
  ];

  doctors: Doctor[] = [
    { id: 1, name: 'Dr. Jean Martin', specialty: 'Oncologie médicale', available: true },
    { id: 2, name: 'Dr. Sophie Chirurgie', specialty: 'Chirurgie oncologique', available: true },
    { id: 3, name: 'Dr. Pierre Radio', specialty: 'Radiologie', available: true },
    { id: 4, name: 'Dr. Marie Anatomo', specialty: 'Anatomopathologie', available: true },
    { id: 5, name: 'Dr. Paul Cardio', specialty: 'Cardiologie', available: true },
    { id: 6, name: 'Dr. Claire Pneumo', specialty: 'Pneumologie', available: false }
  ];

  meetingTypes = [
    { value: 'virtual', label: 'Virtuelle' },
    { value: 'physical', label: 'Présentielle' },
    { value: 'hybrid', label: 'Hybride' }
  ];

  durations = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 heure' },
    { value: 90, label: '1h30' },
    { value: 120, label: '2 heures' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.rcpForm = this.createForm();
  }

  ngOnInit() {
    this.meetingId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.meetingId;
    
    if (this.isEditMode) {
      this.loadMeeting();
    } else {
      // Set default values for new meeting
      this.rcpForm.patchValue({
        meetingType: 'virtual',
        duration: 60,
        date: this.getNextWeekDate(),
        time: '14:00'
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      patientId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      meetingType: ['', [Validators.required]],
      location: [''],
      pathology: ['', [Validators.required]],
      clinicalSummary: ['', [Validators.required]],
      participants: this.fb.array([])
    });
  }

  get participantsArray(): FormArray {
    return this.rcpForm.get('participants') as FormArray;
  }

  addParticipant() {
    const participantGroup = this.fb.group({
      doctorId: ['', [Validators.required]],
      role: ['participant', [Validators.required]]
    });
    
    this.participantsArray.push(participantGroup);
  }

  removeParticipant(index: number) {
    this.participantsArray.removeAt(index);
  }

  loadMeeting() {
    this.loading = true;
    
    // Mock data - in real app, this would come from a service
    const mockMeeting = {
      title: 'RCP Oncologie - Cas complexe',
      patientId: 1,
      date: '2024-01-25',
      time: '14:00',
      duration: 60,
      meetingType: 'virtual',
      location: 'Salle de réunion A',
      pathology: 'Cancer du sein métastatique',
      clinicalSummary: 'Patiente de 67 ans présentant un cancer du sein T2N1M0, RH+/HER2-.',
      participants: [
        { doctorId: 2, role: 'participant' },
        { doctorId: 3, role: 'participant' }
      ]
    };
    
    setTimeout(() => {
      this.rcpForm.patchValue(mockMeeting);
      
      // Add participants
      mockMeeting.participants.forEach(participant => {
        const participantGroup = this.fb.group({
          doctorId: [participant.doctorId, [Validators.required]],
          role: [participant.role, [Validators.required]]
        });
        this.participantsArray.push(participantGroup);
      });
      
      this.loading = false;
    }, 1000);
  }

  onSubmit() {
    if (this.rcpForm.valid) {
      this.loading = true;
      const formData = this.rcpForm.value;
      
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        const message = this.isEditMode ? 'RCP mise à jour avec succès' : 'RCP programmée avec succès';
        this.snackBar.open(message, 'Fermer', { duration: 3000 });
        this.router.navigate(['/rcp']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/rcp']);
  }

  getSelectedPatient(): Patient | undefined {
    const patientId = this.rcpForm.get('patientId')?.value;
    return this.patients.find(p => p.id === patientId);
  }

  getAvailableDoctors(): Doctor[] {
    return this.doctors.filter(d => d.available);
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? `${doctor.name} (${doctor.specialty})` : '';
  }

  getNextWeekDate(): string {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private markFormGroupTouched() {
    Object.keys(this.rcpForm.controls).forEach(key => {
      const control = this.rcpForm.get(key);
      control?.markAsTouched();
    });
    
    this.participantsArray.controls.forEach(group => {
      Object.keys(group.value).forEach(key => {
        const control = group.get(key);
        control?.markAsTouched();
      });
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.rcpForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    return '';
  }

  formatDateTime(): string {
    const date = this.rcpForm.get('date')?.value;
    const time = this.rcpForm.get('time')?.value;
    
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toLocaleString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return '';
  }
}